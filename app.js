/**
 * 心理健康自评系统：SCL-90 商用兼容前端框架
 * ------------------------------------------------------
 * 重要：本文件内置的是“原创演示题库”，不是 SCL-90/SCL-90-R 官方题项。
 * 如果要商用 SCL-90/SCL-90-R，请取得量表题项、常模和解释规则授权后，替换 QUESTIONS 与 DIMENSIONS。
 */

const CONFIG = {
  appName: "心理健康自评系统",
  accessCode: "SCL2026",
  pageSize: 10,
  scaleMax: 4,
  optionLabels: [
    { value: 0, label: "没有", desc: "0" },
    { value: 1, label: "很轻", desc: "1" },
    { value: 2, label: "中等", desc: "2" },
    { value: 3, label: "偏重", desc: "3" },
    { value: 4, label: "严重", desc: "4" }
  ]
};

const DIMENSIONS = [
  { key: "som", name: "躯体化", short: "躯体" },
  { key: "ocd", name: "强迫倾向", short: "强迫" },
  { key: "inter", name: "人际敏感", short: "人际" },
  { key: "dep", name: "抑郁情绪", short: "抑郁" },
  { key: "anx", name: "焦虑情绪", short: "焦虑" },
  { key: "host", name: "敌对情绪", short: "敌对" },
  { key: "phob", name: "恐怖/回避", short: "恐怖" },
  { key: "para", name: "偏执观念", short: "偏执" },
  { key: "psy", name: "精神病性体验", short: "精神性" },
  { key: "other", name: "睡眠与其他", short: "其他" }
];



const DIMENSION_EXPLANATIONS = {
  som: {
    meaning: "反映个体把压力、焦虑或疲劳体验为身体不适的程度，例如头痛、胸闷、胃肠不适、疲乏等。该指标升高不等于存在躯体疾病，也不排除真实身体问题。",
    signs: "常见表现包括反复关注身体感受、轻微不适被放大、休息后仍疲惫、身体症状影响工作学习。",
    advice: "建议先保证睡眠、规律饮食、适度运动，记录身体不适与压力事件的关系；若症状持续或明显加重，应优先进行医学检查。",
    help: "若疼痛、胸闷、呼吸困难等症状明显，或已影响日常功能，应及时就医；若医学检查无明显异常但困扰持续，可寻求心理咨询。"
  },
  ocd: {
    meaning: "反映重复想法、重复确认、过度追求确定性或完美的倾向。分数升高通常提示心理能量被反复检查和反复思考消耗。",
    signs: "常见表现包括反复检查门锁、文件、消息，难以停止某个念头，做事耗时明显增加，对细节错误高度焦虑。",
    advice: "可以尝试设定检查次数上限、用清单替代反复确认、练习容忍不确定性，并把任务拆分为可完成的小步骤。",
    help: "若重复行为每天占用大量时间，或明显影响学习、工作和关系，建议寻求专业心理咨询或精神科评估。"
  },
  inter: {
    meaning: "反映在人际互动中对评价、拒绝、比较和关系变化的敏感程度。该维度升高通常与自我评价波动和社交压力有关。",
    signs: "常见表现包括担心别人不喜欢自己、反复回想对话细节、害怕表达真实想法、在人群中不自在。",
    advice: "建议练习区分事实与猜测，减少过度解读；从低压力社交开始，逐步增加表达和边界练习。",
    help: "若因人际压力长期回避社交、亲密关系反复冲突，或自我价值感显著下降，可寻求专业支持。"
  },
  dep: {
    meaning: "反映低落、兴趣下降、无助感、价值感下降和动力不足等抑郁相关体验。该结果只提示情绪困扰水平，不构成抑郁症诊断。",
    signs: "常见表现包括提不起兴趣、效率下降、悲观、空虚、回避交流、注意力和决策能力变差。",
    advice: "建议保持基本作息，安排小而确定的行动，减少独处时间，记录情绪变化，并寻求稳定的社会支持。",
    help: "若低落持续两周以上、明显影响生活，或出现自伤、自杀想法，应立即联系身边可信任的人和专业机构。"
  },
  anx: {
    meaning: "反映紧张、担忧、坐立不安、过度预期负面结果等焦虑体验。分数升高说明当前压力系统可能处于较高唤醒状态。",
    signs: "常见表现包括心慌、肌肉紧绷、反复担心、难以放松、对不确定事件过度准备。",
    advice: "建议进行腹式呼吸、渐进式肌肉放松，限制反复搜索和确认，把担心写成问题并拆解可行动步骤。",
    help: "若焦虑伴随惊恐发作、失眠、明显回避，或影响工作学习，应寻求专业评估。"
  },
  host: {
    meaning: "反映烦躁、愤怒、敌意、攻击冲动和冲突后的恢复困难。该指标升高常与长期压力、睡眠不足或关系压力有关。",
    signs: "常见表现包括易怒、不耐烦、争辩冲动、对他人意图更消极、冲突后长时间难以平复。",
    advice: "建议在冲突前暂停回应，使用延迟表达、运动释放和睡眠修复；把愤怒背后的需求具体写出来。",
    help: "若愤怒导致伤害自己或他人、破坏关系或出现失控行为，应尽快寻求专业帮助。"
  },
  phob: {
    meaning: "反映对特定场景、对象或公共情境的恐惧与回避程度。分数升高提示回避行为可能正在缩小活动范围。",
    signs: "常见表现包括害怕人多、封闭、陌生环境，提前担心外出，因害怕不适而减少行动。",
    advice: "建议记录回避场景，按难度建立逐级暴露清单，从低强度场景开始练习，而不是一次性强迫自己面对。",
    help: "若恐惧导致无法正常上班、上学、出行或社交，应寻求心理治疗或精神科评估。"
  },
  para: {
    meaning: "反映对他人意图、评价和安全性的怀疑、防备与被针对感。升高时，个体可能更容易把模糊信息解释为负面。",
    signs: "常见表现包括反复揣测别人话里含义、担心被利用、难以信任、把偶然事件与自己联系起来。",
    advice: "建议把判断分成事实、推测和证据三栏，延迟做负面结论，并通过可信任关系进行现实检验。",
    help: "若怀疑感强烈、持续，或导致严重人际冲突、睡眠受损和功能下降，建议寻求专业评估。"
  },
  psy: {
    meaning: "反映思维混乱、现实感下降、疏离感、异常体验或难以解释的内在感受。该维度需要谨慎解释，不能由自评直接推断疾病。",
    signs: "常见表现包括注意力难以回到现实任务、感到不真实、与周围人疏离、担心自己的体验不正常。",
    advice: "建议减少熬夜和高压力刺激，保持规律生活，记录异常体验发生的时间、诱因、持续时长和影响。",
    help: "若出现明显幻听幻视、被控制感、严重混乱、无法维持现实功能，应尽快联系精神科或急诊资源。"
  },
  other: {
    meaning: "反映睡眠、作息、精力、效率和生活节律等补充指标。它常常是压力和情绪问题最早出现的信号之一。",
    signs: "常见表现包括入睡困难、早醒、醒后不恢复、拖延、节律紊乱、对日常安排失去掌控感。",
    advice: "建议固定起床时间，减少睡前屏幕刺激，建立轻量运动和任务清单，先恢复生活节律再处理复杂问题。",
    help: "若失眠、食欲改变或效率下降持续存在，并明显影响生活，应寻求专业帮助。"
  }
};

const DEMO_QUESTION_BANK = {
  som: [
    "过去一周，我明显感到头部或身体不适影响状态。",
    "过去一周，我感到胸闷、心慌或呼吸不太顺畅。",
    "过去一周，我的胃肠、食欲或消化状态让我困扰。",
    "过去一周，我感到身体疲乏、沉重或精力不足。",
    "过去一周，我因疼痛、酸胀或麻木而感到不安。",
    "过去一周，我容易关注身体细微变化并因此担心。",
    "过去一周，我觉得身体不适影响了学习、工作或社交。",
    "过去一周，我出现过头晕、发冷、发热或类似不适。",
    "过去一周，我对自己的身体健康状态感到明显担忧。"
  ],
  ocd: [
    "过去一周，我反复检查某些事情，即使知道可能没有必要。",
    "过去一周，我难以停止某些重复想法或重复行为。",
    "过去一周，我做事时很难放下对细节或顺序的要求。",
    "过去一周，我觉得必须反复确认后才安心。",
    "过去一周，我会被某些不想出现的念头反复打扰。",
    "过去一周，我完成事情的速度明显受到反复确认影响。",
    "过去一周，我对整洁、准确或对错的要求让我紧张。",
    "过去一周，我担心自己遗漏了重要细节。",
    "过去一周，我很难从某个念头中抽离出来。"
  ],
  inter: [
    "过去一周，我在人际交往中容易感到不自在。",
    "过去一周，我担心别人不认可我或评价我。",
    "过去一周，我容易把别人的反应理解为对自己的否定。",
    "过去一周，我在表达真实想法时感到困难。",
    "过去一周，我觉得自己在群体中不够放松。",
    "过去一周，我因比较自己和他人而感到压力。",
    "过去一周，我害怕被忽视、拒绝或误解。",
    "过去一周，我在亲近关系中感到敏感或受伤。",
    "过去一周，我常常回想自己在人际互动中的表现。"
  ],
  dep: [
    "过去一周，我感到情绪低落或提不起兴趣。",
    "过去一周，我对原本喜欢的事情明显缺乏动力。",
    "过去一周，我容易感到无助、失落或空虚。",
    "过去一周，我对未来感到悲观或缺乏期待。",
    "过去一周，我做决定或集中注意力变得困难。",
    "过去一周，我觉得自己的价值感下降。",
    "过去一周，我更容易独处或回避与人交流。",
    "过去一周，我常常觉得生活压力难以承受。",
    "过去一周，我的情绪恢复速度比平时更慢。"
  ],
  anx: [
    "过去一周，我经常感到紧张、担心或坐立不安。",
    "过去一周，我会无缘由地预期坏事发生。",
    "过去一周，我面对任务或选择时容易过度担忧。",
    "过去一周，我的身体紧绷、难以放松。",
    "过去一周，我容易被突发变化打乱情绪。",
    "过去一周，我因担心结果而反复思考。",
    "过去一周，我觉得压力使自己难以保持平静。",
    "过去一周，我出现过明显的惊慌或急迫感。",
    "过去一周，我需要花较多时间让自己安定下来。"
  ],
  host: [
    "过去一周，我比平时更容易烦躁或发火。",
    "过去一周，我对他人的言行更容易产生不满。",
    "过去一周，我很难控制自己的急躁情绪。",
    "过去一周，我在冲突后仍长时间难以平复。",
    "过去一周，我有想要争辩、顶撞或反击的冲动。",
    "过去一周，我对周围环境的容忍度下降。",
    "过去一周，我容易用消极方式解读他人的意图。",
    "过去一周，我因愤怒影响了沟通或判断。",
    "过去一周，我需要压抑明显的不耐烦或敌意。"
  ],
  phob: [
    "过去一周，我会回避某些让我明显紧张的场景。",
    "过去一周，我在特定地点或场合会感到强烈不安。",
    "过去一周，我担心自己在公共场合失控或出丑。",
    "过去一周，我因害怕不适而减少外出或活动。",
    "过去一周，我面对人多、封闭或陌生环境时感到紧张。",
    "过去一周，我对某些对象、场景或活动有明显回避。",
    "过去一周，我会提前担心即将到来的社交或外出安排。",
    "过去一周，我因担心焦虑反应而限制自己的行动。",
    "过去一周，我觉得某些场景会触发强烈恐惧感。"
  ],
  para: [
    "过去一周，我较容易怀疑别人对我有负面看法。",
    "过去一周，我担心他人隐藏真实意图。",
    "过去一周，我容易觉得自己被针对或被不公平对待。",
    "过去一周，我对他人的承诺或解释不太放心。",
    "过去一周，我会反复揣测别人话里的深层含义。",
    "过去一周，我较难信任他人的善意。",
    "过去一周，我担心自己的信息或隐私被利用。",
    "过去一周，我容易把偶然事件联系到自己身上。",
    "过去一周，我在关系中保持较强防备感。"
  ],
  psy: [
    "过去一周，我有时觉得自己的想法变得很混乱。",
    "过去一周，我觉得周围事物有不真实或疏离感。",
    "过去一周，我偶尔感到难以把注意力放回现实任务。",
    "过去一周，我有一些难以向别人解释的特殊感受。",
    "过去一周，我觉得自己和周围人的距离感明显增强。",
    "过去一周，我会担心自己的感受或想法不太正常。",
    "过去一周，我对外界刺激的反应比平时更敏感。",
    "过去一周，我有时感觉自己的思路难以被别人理解。",
    "过去一周，我感到内在体验与现实生活之间有割裂感。"
  ],
  other: [
    "过去一周，我的睡眠质量明显下降。",
    "过去一周，我入睡、早醒或睡后恢复感存在困扰。",
    "过去一周，我的食欲、作息或日常节律发生明显变化。",
    "过去一周，我觉得休息后仍难以恢复精力。",
    "过去一周，我更容易依赖拖延、逃避或刷手机来缓解压力。",
    "过去一周，我对学习、工作或生活安排的掌控感下降。",
    "过去一周，我很难维持稳定的生活节奏。",
    "过去一周，我感到压力影响了日常效率。",
    "过去一周，我需要更多外界支持才能完成平常事务。"
  ]
};

const QUESTIONS = DIMENSIONS.flatMap((dim) =>
  DEMO_QUESTION_BANK[dim.key].map((text, i) => ({
    id: DIMENSIONS.findIndex((d) => d.key === dim.key) * 9 + i + 1,
    dim: dim.key,
    text
  }))
);

const state = {
  page: 0,
  answers: {},
  reportText: "",
  lastResult: null
};

const $ = (id) => document.getElementById(id);
const views = ["verifyView", "consentView", "surveyView", "resultView"];

function showView(id) {
  views.forEach((viewId) => $(viewId).classList.toggle("active", viewId === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toast(message) {
  const el = document.createElement("div");
  el.textContent = message;
  el.style.cssText = `
    position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%);
    background: rgba(21,34,56,.94); color: #fff; padding: 12px 16px;
    border-radius: 999px; z-index: 9999; box-shadow: 0 12px 34px rgba(0,0,0,.22);
    font-weight: 800; max-width: calc(100% - 40px); text-align: center;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

function renderQuestions() {
  const start = state.page * CONFIG.pageSize;
  const pageQuestions = QUESTIONS.slice(start, start + CONFIG.pageSize);
  $("pageTitle").textContent = `第 ${state.page + 1} 组题目`;
  $("pageText").textContent = `第 ${state.page + 1} / ${Math.ceil(QUESTIONS.length / CONFIG.pageSize)} 页`;

  const answeredCount = Object.keys(state.answers).length;
  $("progressText").textContent = `${answeredCount} / ${QUESTIONS.length}`;
  $("progressBar").style.width = `${(answeredCount / QUESTIONS.length) * 100}%`;

  $("prevBtn").disabled = state.page === 0;
  $("nextBtn").textContent = state.page === Math.ceil(QUESTIONS.length / CONFIG.pageSize) - 1 ? "生成报告" : "下一页";

  $("questionList").innerHTML = pageQuestions.map((q) => {
    const current = state.answers[q.id];
    const options = CONFIG.optionLabels.map((opt) => `
      <label class="option ${current === opt.value ? "active" : ""}" data-qid="${q.id}" data-value="${opt.value}">
        <input type="radio" name="q${q.id}" value="${opt.value}" ${current === opt.value ? "checked" : ""} />
        ${opt.label}<small>${opt.desc} 分</small>
      </label>
    `).join("");
    return `
      <article class="question-card" id="card-${q.id}">
        <div class="q-title"><span class="q-index">Q${String(q.id).padStart(2, "0")}</span><span>${q.text}</span></div>
        <div class="options">${options}</div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", () => {
      const qid = Number(option.dataset.qid);
      const value = Number(option.dataset.value);
      state.answers[qid] = value;
      const card = $(`card-${qid}`);
      card.classList.remove("missing");
      card.querySelectorAll(".option").forEach((el) => el.classList.remove("active"));
      option.classList.add("active");
      const answeredCount = Object.keys(state.answers).length;
      $("progressText").textContent = `${answeredCount} / ${QUESTIONS.length}`;
      $("progressBar").style.width = `${(answeredCount / QUESTIONS.length) * 100}%`;
    });
  });
}

function validatePage() {
  const start = state.page * CONFIG.pageSize;
  const pageQuestions = QUESTIONS.slice(start, start + CONFIG.pageSize);
  const missing = pageQuestions.filter((q) => state.answers[q.id] === undefined);
  document.querySelectorAll(".question-card").forEach((el) => el.classList.remove("missing"));
  if (missing.length > 0) {
    missing.forEach((q) => $(`card-${q.id}`)?.classList.add("missing"));
    $(`card-${missing[0].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    toast(`本页还有 ${missing.length} 题未作答`);
    return false;
  }
  return true;
}

function calculateResults() {
  const scores = QUESTIONS.map((q) => Number(state.answers[q.id] ?? 0));
  const total = scores.reduce((a, b) => a + b, 0);
  const mean = total / QUESTIONS.length;
  const positiveScores = scores.filter((s) => s > 0);
  const positiveCount = positiveScores.length;
  const psdi = positiveCount ? positiveScores.reduce((a, b) => a + b, 0) / positiveCount : 0;

  const dimensions = DIMENSIONS.map((dim) => {
    const qs = QUESTIONS.filter((q) => q.dim === dim.key);
    const values = qs.map((q) => Number(state.answers[q.id] ?? 0));
    const sum = values.reduce((a, b) => a + b, 0);
    return {
      ...dim,
      count: values.length,
      sum,
      mean: sum / values.length,
      positiveCount: values.filter((v) => v > 0).length
    };
  }).sort((a, b) => b.mean - a.mean);

  return { total, mean, positiveCount, psdi, dimensions };
}

function getRisk(mean) {
  if (mean < 1) return { label: "低困扰水平", cls: "risk-low", description: "当前总体困扰水平较低，建议保持规律作息、运动和稳定社交支持。" };
  if (mean < 2) return { label: "轻度困扰", cls: "risk-mid", description: "当前存在一定心理困扰，建议关注压力来源，尝试睡眠、运动、情绪记录等自我调节方式。" };
  if (mean < 3) return { label: "中高困扰", cls: "risk-high", description: "当前困扰水平较明显，建议尽快寻求专业心理咨询、精神科或校企心理服务支持。" };
  return { label: "高困扰水平", cls: "risk-high", description: "当前困扰水平较高，建议优先联系专业人员进行进一步评估；若伴随危机想法，请立即寻求线下帮助。" };
}

function renderRadar(dimensions) {
  const size = 320;
  const cx = 160;
  const cy = 160;
  const maxR = 108;
  const n = dimensions.length;
  const points = dimensions.map((dim, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (dim.mean / CONFIG.scaleMax) * maxR;
    return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
  }).join(" ");

  const grid = [0.25, 0.5, 0.75, 1].map((ratio) => {
    const poly = dimensions.map((_, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = ratio * maxR;
      return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
    }).join(" ");
    return `<polygon points="${poly}" fill="none" stroke="rgba(96,112,138,.20)" stroke-width="1"/>`;
  }).join("");

  const axes = dimensions.map((dim, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const x = cx + Math.cos(angle) * maxR;
    const y = cy + Math.sin(angle) * maxR;
    const tx = cx + Math.cos(angle) * (maxR + 30);
    const ty = cy + Math.sin(angle) * (maxR + 30);
    return `
      <line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(96,112,138,.14)" />
      <text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="800" fill="#60708a">${dim.short}</text>
    `;
  }).join("");

  $("radarChart").innerHTML = `
    <svg viewBox="0 0 ${size} ${size}" role="img" aria-label="维度雷达图">
      ${grid}
      ${axes}
      <polygon points="${points}" fill="rgba(79,124,255,.22)" stroke="#4f7cff" stroke-width="3" />
      ${dimensions.map((dim, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const r = (dim.mean / CONFIG.scaleMax) * maxR;
        return `<circle cx="${cx + Math.cos(angle) * r}" cy="${cy + Math.sin(angle) * r}" r="4" fill="#7357ff" />`;
      }).join("")}
    </svg>
  `;
}

function renderBarChart(dimensions) {
  $("barChart").innerHTML = dimensions.map((dim) => `
    <div class="bar-row">
      <div class="bar-label">${dim.name}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(dim.mean / CONFIG.scaleMax) * 100}%"></div></div>
      <div class="bar-value">${dim.mean.toFixed(2)}</div>
    </div>
  `).join("");
}


function getDimensionLevel(mean) {
  if (mean < 1) return { label: "低水平", cls: "level-low", text: "该维度困扰较低，当前未表现为主要压力来源。" };
  if (mean < 2) return { label: "轻度", cls: "level-mid", text: "该维度存在一定困扰，建议持续观察并进行生活方式调整。" };
  if (mean < 3) return { label: "中度", cls: "level-high", text: "该维度困扰较明显，建议结合现实压力源进行重点关注。" };
  return { label: "较高", cls: "level-high", text: "该维度困扰较高，若持续存在或影响功能，建议寻求专业评估。" };
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderDimensionDetails(dimensions) {
  const ordered = DIMENSIONS.map((dim) => dimensions.find((item) => item.key === dim.key));
  $("dimensionDetails").innerHTML = ordered.map((dim) => {
    const level = getDimensionLevel(dim.mean);
    const exp = DIMENSION_EXPLANATIONS[dim.key];
    return `
      <article class="dimension-detail-card" data-dim="${dim.key}">
        <button class="detail-head" type="button" aria-expanded="false">
          <div>
            <div class="detail-title">
              <strong>${escapeHtml(dim.name)}</strong>
              <span class="level-tag ${level.cls}">${level.label}</span>
            </div>
            <div class="detail-metrics">均分 ${dim.mean.toFixed(2)} / ${CONFIG.scaleMax} · 总分 ${dim.sum} · 阳性题数 ${dim.positiveCount}/${dim.count}</div>
          </div>
          <span class="detail-toggle">进一步解释</span>
        </button>
        <div class="detail-body">
          <p>${escapeHtml(level.text)} ${escapeHtml(exp.meaning)}</p>
          <div class="detail-grid">
            <div class="detail-block"><h4>常见表现</h4><p>${escapeHtml(exp.signs)}</p></div>
            <div class="detail-block"><h4>自我调节建议</h4><p>${escapeHtml(exp.advice)}</p></div>
          </div>
          <div class="detail-warning"><strong>需要进一步帮助的情形：</strong>${escapeHtml(exp.help)}</div>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".detail-head").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".dimension-detail-card");
      const isOpen = card.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
      btn.querySelector(".detail-toggle").textContent = isOpen ? "收起解释" : "进一步解释";
    });
  });
}

function buildReportText(result) {
  const risk = result.risk;
  const top3 = result.dimensions.slice(0, 3);
  const dimensionLines = DIMENSIONS.map((dimDef) => {
    const dim = result.dimensions.find((d) => d.key === dimDef.key);
    const level = getDimensionLevel(dim.mean);
    return `${dim.name}：均分 ${dim.mean.toFixed(2)}，总分 ${dim.sum}，阳性题数 ${dim.positiveCount}/${dim.count}，水平 ${level.label}`;
  }).join("\n");
  return [
    `【${CONFIG.appName}自评报告】`,
    `测评时间：${new Date().toLocaleString()}`,
    ``,
    `一、核心结果`,
    `总分：${result.total.toFixed(0)}`,
    `总均分：${result.mean.toFixed(2)}`,
    `阳性项目数：${result.positiveCount}`,
    `阳性症状均分：${result.psdi.toFixed(2)}`,
    `总体提示：${risk.label}`,
    `突出维度：${top3.map((d) => `${d.name} ${d.mean.toFixed(2)}`).join("；")}`,
    ``,
    `二、维度明细`,
    dimensionLines,
    ``,
    `三、说明`,
    `本报告仅用于心理健康筛查和自我觉察，不构成医学诊断、治疗建议或危机干预服务。若困扰持续两周以上、明显影响工作学习或关系，建议预约专业人员进一步评估。`
  ].join("\n");
}

function buildExportPayload() {
  if (!state.lastResult) return null;
  const answers = QUESTIONS.map((q) => ({
    id: q.id,
    dimension: DIMENSIONS.find((d) => d.key === q.dim)?.name || q.dim,
    question: q.text,
    score: Number(state.answers[q.id] ?? 0)
  }));
  const dimensions = DIMENSIONS.map((dimDef) => {
    const dim = state.lastResult.dimensions.find((d) => d.key === dimDef.key);
    const level = getDimensionLevel(dim.mean);
    const exp = DIMENSION_EXPLANATIONS[dim.key];
    return {
      key: dim.key,
      name: dim.name,
      sum: dim.sum,
      mean: Number(dim.mean.toFixed(4)),
      count: dim.count,
      positiveCount: dim.positiveCount,
      level: level.label,
      explanation: exp
    };
  });
  return {
    appName: CONFIG.appName,
    generatedAt: new Date().toISOString(),
    disclaimer: "本报告仅用于心理健康筛查和自我觉察，不构成医学诊断、治疗建议或危机干预服务。",
    scores: {
      total: state.lastResult.total,
      mean: Number(state.lastResult.mean.toFixed(4)),
      positiveCount: state.lastResult.positiveCount,
      psdi: Number(state.lastResult.psdi.toFixed(4)),
      riskLabel: state.lastResult.risk.label,
      riskDescription: state.lastResult.risk.description
    },
    dimensions,
    answers
  };
}

function toCsv(rows) {
  return rows.map((row) => row.map((cell) => {
    const value = String(cell ?? "").replaceAll('"', '""');
    return /[",\n]/.test(value) ? `"${value}"` : value;
  }).join(",")).join("\n");
}

function buildCsvText() {
  const payload = buildExportPayload();
  const rows = [
    ["类型", "指标/题号", "名称/题目", "分数/均分", "阳性数", "水平/维度"]
  ];
  payload.dimensions.forEach((d) => rows.push(["维度", d.key, d.name, d.mean, `${d.positiveCount}/${d.count}`, d.level]));
  payload.answers.forEach((a) => rows.push(["题目", a.id, a.question, a.score, "", a.dimension]));
  return "\ufeff" + toCsv(rows);
}

function downloadBlob(content, filename, type = "text/plain;charset=utf-8") {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function fileSlug() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = String(text).split("");
  let line = "";
  chars.forEach((ch) => {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = ch;
      y += lineHeight;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}

function makeRadarCanvas(dimensions) {
  const ordered = DIMENSIONS.map((dim) => dimensions.find((d) => d.key === dim.key));
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 960;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#152238";
  ctx.font = "bold 38px Microsoft YaHei, Arial";
  ctx.fillText("维度雷达图", 60, 72);
  const cx = 600, cy = 500, maxR = 280, n = ordered.length;
  ctx.strokeStyle = "rgba(96,112,138,.35)";
  ctx.lineWidth = 2;
  [0.25, 0.5, 0.75, 1].forEach((ratio) => {
    ctx.beginPath();
    ordered.forEach((_, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = cx + Math.cos(angle) * maxR * ratio;
      const y = cy + Math.sin(angle) * maxR * ratio;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
  });
  ordered.forEach((dim, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
    ctx.stroke();
    ctx.fillStyle = "#60708a";
    ctx.font = "bold 24px Microsoft YaHei, Arial";
    ctx.textAlign = "center";
    ctx.fillText(dim.short, cx + Math.cos(angle) * (maxR + 60), cy + Math.sin(angle) * (maxR + 60));
  });
  ctx.beginPath();
  ordered.forEach((dim, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (dim.mean / CONFIG.scaleMax) * maxR;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(79,124,255,.22)";
  ctx.fill();
  ctx.strokeStyle = "#4f7cff";
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.textAlign = "left";
  return canvas;
}

function makeBarCanvas(dimensions) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 980;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#152238";
  ctx.font = "bold 38px Microsoft YaHei, Arial";
  ctx.fillText("维度得分排序", 60, 72);
  const x = 260, y0 = 130, barW = 760, barH = 32, gap = 52;
  dimensions.forEach((dim, i) => {
    const y = y0 + i * gap;
    ctx.fillStyle = "#152238";
    ctx.font = "bold 24px Microsoft YaHei, Arial";
    ctx.textAlign = "right";
    ctx.fillText(dim.name, x - 24, y + 24);
    ctx.fillStyle = "#e8efff";
    roundRect(ctx, x, y, barW, barH, 16, true, false);
    ctx.fillStyle = "#4f7cff";
    roundRect(ctx, x, y, barW * (dim.mean / CONFIG.scaleMax), barH, 16, true, false);
    ctx.fillStyle = "#60708a";
    ctx.textAlign = "left";
    ctx.fillText(dim.mean.toFixed(2), x + barW + 24, y + 24);
  });
  ctx.textAlign = "left";
  return canvas;
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
}

async function downloadRadarPng() {
  const canvas = makeRadarCanvas(DIMENSIONS.map((dim) => state.lastResult.dimensions.find((d) => d.key === dim.key)));
  const blob = await canvasToBlob(canvas);
  downloadBlob(blob, `维度雷达图_${fileSlug()}.png`, "image/png");
}

async function downloadBarPng() {
  const canvas = makeBarCanvas(state.lastResult.dimensions);
  const blob = await canvasToBlob(canvas);
  downloadBlob(blob, `维度得分排序_${fileSlug()}.png`, "image/png");
}

function downloadJson() {
  downloadBlob(JSON.stringify(buildExportPayload(), null, 2), `心理健康自评完整数据_${fileSlug()}.json`, "application/json;charset=utf-8");
}

function downloadCsv() {
  downloadBlob(buildCsvText(), `心理健康自评数据_${fileSlug()}.csv`, "text/csv;charset=utf-8");
}

async function downloadPdf() {
  if (!window.html2canvas || !window.jspdf?.jsPDF) {
    toast("PDF组件未加载，已打开打印窗口，可选择另存为 PDF");
    window.print();
    return;
  }
  const originalTitle = document.title;
  document.title = `心理健康自评报告_${fileSlug()}`;
  document.body.classList.add("export-mode");
  try {
    const node = $("resultView");
    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      windowWidth: node.scrollWidth,
      windowHeight: node.scrollHeight
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new window.jspdf.jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(`心理健康自评报告_${fileSlug()}.pdf`);
  } catch (err) {
    console.error(err);
    toast("PDF导出失败，已打开打印窗口，可选择另存为 PDF");
    window.print();
  } finally {
    document.body.classList.remove("export-mode");
    document.title = originalTitle;
  }
}

async function downloadZip() {
  if (!window.JSZip) {
    toast("完整数据包组件未加载，将分别下载 JSON、CSV 和图表");
    downloadJson();
    downloadCsv();
    await downloadRadarPng();
    await downloadBarPng();
    return;
  }
  const zip = new JSZip();
  zip.file("心理健康自评报告摘要.txt", state.reportText);
  zip.file("心理健康自评完整数据.json", JSON.stringify(buildExportPayload(), null, 2));
  zip.file("心理健康自评数据.csv", buildCsvText());
  const radarBlob = await canvasToBlob(makeRadarCanvas(DIMENSIONS.map((dim) => state.lastResult.dimensions.find((d) => d.key === dim.key))));
  const barBlob = await canvasToBlob(makeBarCanvas(state.lastResult.dimensions));
  zip.file("维度雷达图.png", radarBlob);
  zip.file("维度得分排序.png", barBlob);
  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `心理健康自评完整数据包_${fileSlug()}.zip`, "application/zip");
}

function renderResults() {
  const result = calculateResults();
  const risk = getRisk(result.mean);
  result.risk = risk;
  state.lastResult = result;

  const riskPill = $("riskPill");
  riskPill.textContent = risk.label;
  riskPill.className = `risk-pill ${risk.cls}`;

  $("totalScore").textContent = result.total.toFixed(0);
  $("meanScore").textContent = result.mean.toFixed(2);
  $("positiveCount").textContent = result.positiveCount;
  $("psdiScore").textContent = result.psdi.toFixed(2);

  const orderedForRadar = DIMENSIONS.map((dim) => result.dimensions.find((d) => d.key === dim.key));
  renderRadar(orderedForRadar);
  renderBarChart(result.dimensions);
  renderDimensionDetails(result.dimensions);

  const top3 = result.dimensions.slice(0, 3);
  $("interpretation").textContent = `${risk.description} 当前相对突出的维度为：${top3.map((d) => `${d.name}（均分 ${d.mean.toFixed(2)}）`).join("、")}。请把该结果理解为自我观察线索，而不是疾病标签。若困扰持续两周以上、明显影响工作学习或关系，建议预约专业人员进一步评估。`;
  $("dimensionSummary").innerHTML = top3.map((d) => `<span class="dimension-chip">${d.name}：${d.mean.toFixed(2)}</span>`).join("");

  state.reportText = buildReportText(result);
}

function downloadReport() {
  const blob = new Blob([state.reportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `心理健康自评报告_${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function resetAll() {
  state.page = 0;
  state.answers = {};
  state.reportText = "";
  state.lastResult = null;
  renderQuestions();
  showView("consentView");
}

$("verifyForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const code = $("accessCode").value.trim();
  if (code !== CONFIG.accessCode) {
    toast("访问码不正确，请重新输入");
    return;
  }
  showView("consentView");
});

$("agreeConsent").addEventListener("change", (event) => {
  $("startBtn").disabled = !event.target.checked;
});

$("startBtn").addEventListener("click", () => {
  renderQuestions();
  showView("surveyView");
});

$("prevBtn").addEventListener("click", () => {
  if (state.page > 0) {
    state.page -= 1;
    renderQuestions();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

$("nextBtn").addEventListener("click", () => {
  if (!validatePage()) return;
  const lastPage = Math.ceil(QUESTIONS.length / CONFIG.pageSize) - 1;
  if (state.page < lastPage) {
    state.page += 1;
    renderQuestions();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    renderResults();
    showView("resultView");
  }
});

$("copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(state.reportText);
    toast("报告摘要已复制");
  } catch {
    toast("复制失败，可使用下载报告功能");
  }
});
$("downloadPdfBtn").addEventListener("click", downloadPdf);
$("downloadZipBtn").addEventListener("click", downloadZip);
$("downloadRadarBtn").addEventListener("click", downloadRadarPng);
$("downloadBarBtn").addEventListener("click", downloadBarPng);
$("downloadCsvBtn").addEventListener("click", downloadCsv);
$("downloadJsonBtn").addEventListener("click", downloadJson);
$("expandAllBtn").addEventListener("click", () => {
  const cards = [...document.querySelectorAll(".dimension-detail-card")];
  const shouldOpen = cards.some((card) => !card.classList.contains("open"));
  cards.forEach((card) => {
    card.classList.toggle("open", shouldOpen);
    const btn = card.querySelector(".detail-head");
    if (btn) {
      btn.setAttribute("aria-expanded", String(shouldOpen));
      btn.querySelector(".detail-toggle").textContent = shouldOpen ? "收起解释" : "进一步解释";
    }
  });
  $("expandAllBtn").textContent = shouldOpen ? "收起全部" : "展开全部";
});
$("printBtn").addEventListener("click", () => window.print());
$("restartBtn").addEventListener("click", resetAll);
