/**
 * SCL-90 one-time access-code server for Cloudflare Workers + KV
 * Routes:
 *   POST /api/redeem              { code }
 *   GET  /health
 *   GET  /admin/codes             Authorization: Bearer <ADMIN_TOKEN>
 *   POST /admin/generate          Authorization: Bearer <ADMIN_TOKEN>, { count, prefix, batch, note }
 *   POST /admin/import            Authorization: Bearer <ADMIN_TOKEN>, { codes, batch, note }
 *   POST /admin/disable           Authorization: Bearer <ADMIN_TOKEN>, { codes }
 *   POST /admin/delete            Authorization: Bearer <ADMIN_TOKEN>, { codes }
 */

const SESSION_TTL_SECONDS = 60 * 60 * 3;
const MAX_GENERATE_COUNT = 500;

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "*";
  const allowOrigin = env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin === "*" ? origin : allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(data, status = 200, request, env) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      ...corsHeaders(request, env)
    }
  });
}

function normalizeCode(code) {
  return String(code || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "");
}

function randomPart(length = 10) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

function getAdminToken(request) {
  const auth = request.headers.get("Authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
  return request.headers.get("X-Admin-Token") || "";
}

function assertAdmin(request, env) {
  const token = getAdminToken(request);
  return Boolean(env.ADMIN_TOKEN && token && token === env.ADMIN_TOKEN);
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function redeem(request, env) {
  const body = await readJson(request);
  const code = normalizeCode(body.code);
  if (!code) return json({ ok: false, message: "请输入访问码" }, 400, request, env);

  const key = `code:${code}`;
  const item = await env.ACCESS_CODES.get(key, { type: "json" });
  if (!item) return json({ ok: false, message: "访问码不存在" }, 404, request, env);
  if (item.status === "used") return json({ ok: false, message: "访问码已使用" }, 409, request, env);
  if (item.status === "disabled") return json({ ok: false, message: "访问码已停用" }, 403, request, env);
  if (item.status !== "valid") return json({ ok: false, message: "访问码状态不可用" }, 409, request, env);

  const now = new Date().toISOString();
  const sessionToken = crypto.randomUUID();
  const updated = {
    ...item,
    code,
    status: "used",
    usedAt: now,
    userAgent: request.headers.get("User-Agent") || "",
    ipHash: await sha256(request.headers.get("CF-Connecting-IP") || ""),
    sessionTokenPreview: sessionToken.slice(0, 8)
  };

  // KV is eventually consistent; this is sufficient for low-volume Taobao/manual code sales.
  // For high-concurrency flash sales, replace KV with Durable Objects or D1 transaction logic.
  await env.ACCESS_CODES.put(key, JSON.stringify(updated));
  await env.ACCESS_CODES.put(`session:${sessionToken}`, JSON.stringify({ code, createdAt: now }), { expirationTtl: SESSION_TTL_SECONDS });

  return json({ ok: true, message: "验证成功", sessionToken, expiresIn: SESSION_TTL_SECONDS }, 200, request, env);
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
}

async function adminGenerate(request, env) {
  if (!assertAdmin(request, env)) return json({ ok: false, message: "Unauthorized" }, 401, request, env);
  const body = await readJson(request);
  const count = Math.max(1, Math.min(Number(body.count || 20), MAX_GENERATE_COUNT));
  const prefix = normalizeCode(body.prefix || "SCL90").slice(0, 12) || "SCL90";
  const batch = String(body.batch || new Date().toISOString().slice(0, 10));
  const note = String(body.note || "");
  const now = new Date().toISOString();
  const codes = [];

  for (let i = 0; i < count; i += 1) {
    let code = `${prefix}-${randomPart(4)}-${randomPart(4)}`;
    while (await env.ACCESS_CODES.get(`code:${code}`)) {
      code = `${prefix}-${randomPart(4)}-${randomPart(4)}`;
    }
    await env.ACCESS_CODES.put(`code:${code}`, JSON.stringify({ code, status: "valid", createdAt: now, batch, note }));
    codes.push(code);
  }
  return json({ ok: true, count: codes.length, codes }, 200, request, env);
}

async function adminImport(request, env) {
  if (!assertAdmin(request, env)) return json({ ok: false, message: "Unauthorized" }, 401, request, env);
  const body = await readJson(request);
  const batch = String(body.batch || new Date().toISOString().slice(0, 10));
  const note = String(body.note || "imported");
  const now = new Date().toISOString();
  const codes = Array.from(new Set((body.codes || []).map(normalizeCode).filter(Boolean)));
  for (const code of codes) {
    await env.ACCESS_CODES.put(`code:${code}`, JSON.stringify({ code, status: "valid", createdAt: now, batch, note }));
  }
  return json({ ok: true, count: codes.length, codes }, 200, request, env);
}

async function adminList(request, env) {
  if (!assertAdmin(request, env)) return json({ ok: false, message: "Unauthorized" }, 401, request, env);
  const url = new URL(request.url);
  const wantedStatus = url.searchParams.get("status") || "all";
  const limit = Math.min(Number(url.searchParams.get("limit") || 1000), 1000);
  const prefixFilter = normalizeCode(url.searchParams.get("prefix") || "");

  const list = await env.ACCESS_CODES.list({ prefix: "code:", limit });
  const rows = [];
  for (const key of list.keys) {
    const item = await env.ACCESS_CODES.get(key.name, { type: "json" });
    if (!item) continue;
    if (wantedStatus !== "all" && item.status !== wantedStatus) continue;
    if (prefixFilter && !item.code.startsWith(prefixFilter)) continue;
    rows.push(item);
  }
  rows.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  const stats = rows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});
  return json({ ok: true, count: rows.length, stats, codes: rows, cursor: list.cursor || null }, 200, request, env);
}

async function adminDisable(request, env) {
  if (!assertAdmin(request, env)) return json({ ok: false, message: "Unauthorized" }, 401, request, env);
  const body = await readJson(request);
  const codes = Array.from(new Set((body.codes || []).map(normalizeCode).filter(Boolean)));
  const now = new Date().toISOString();
  let changed = 0;
  for (const code of codes) {
    const key = `code:${code}`;
    const item = await env.ACCESS_CODES.get(key, { type: "json" });
    if (!item) continue;
    await env.ACCESS_CODES.put(key, JSON.stringify({ ...item, status: "disabled", disabledAt: now }));
    changed += 1;
  }
  return json({ ok: true, changed }, 200, request, env);
}

async function adminDelete(request, env) {
  if (!assertAdmin(request, env)) return json({ ok: false, message: "Unauthorized" }, 401, request, env);
  const body = await readJson(request);
  const codes = Array.from(new Set((body.codes || []).map(normalizeCode).filter(Boolean)));
  for (const code of codes) await env.ACCESS_CODES.delete(`code:${code}`);
  return json({ ok: true, deleted: codes.length }, 200, request, env);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(request, env) });
    const url = new URL(request.url);

    if (url.pathname === "/health") return json({ ok: true, service: "scl90-access-code-worker" }, 200, request, env);
    if (url.pathname === "/api/redeem" && request.method === "POST") return redeem(request, env);
    if (url.pathname === "/admin/generate" && request.method === "POST") return adminGenerate(request, env);
    if (url.pathname === "/admin/import" && request.method === "POST") return adminImport(request, env);
    if (url.pathname === "/admin/codes" && request.method === "GET") return adminList(request, env);
    if (url.pathname === "/admin/disable" && request.method === "POST") return adminDisable(request, env);
    if (url.pathname === "/admin/delete" && request.method === "POST") return adminDelete(request, env);

    return json({ ok: false, message: "Not found" }, 404, request, env);
  }
};
