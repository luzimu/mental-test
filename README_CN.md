<div align="center">
  <img src="assets/mindscope90-hero.svg" alt="MindScope 90 标题图" width="100%" />

  # SCL-90 在线测评系统

  ### 授权版症状自评量表 · PDF报告 · 一次性访问码核销

  [English](README.md) · [简体中文](README_CN.md)

  <p>
    <img alt="SCL-90" src="https://img.shields.io/badge/Scale-SCL--90-22D3EE?style=for-the-badge&labelColor=0F172A">
    <img alt="Scoring" src="https://img.shields.io/badge/Scoring-GSI%20%7C%20PST%20%7C%20PSDI-A78BFA?style=for-the-badge&labelColor=0F172A">
    <img alt="Export" src="https://img.shields.io/badge/Export-PDF%20%7C%20PNG%20%7C%20CSV%20%7C%20JSON-34D399?style=for-the-badge&labelColor=0F172A">
    <img alt="Access Codes" src="https://img.shields.io/badge/Access-One--Time%20Codes-F59E0B?style=for-the-badge&labelColor=0F172A">
  </p>

  **一套可部署的 SCL-90 症状自评量表网页系统，支持授权题库、自动评分、图表分析、指标解释、PDF报告导出和淘宝售卖所需的一次性访问码核销。**
</div>

---

## 项目简介

本项目是一套完整的 SCL-90 在线测评系统，包含：

- 90 项 SCL-90 题目流程
- 1–5 分选项
- 必答校验与进度显示
- 总分、总均分
- GSI、PST、PSDI 国际常用总体指标
- 10 个因子维度评分，包括睡眠/饮食等附加项目
- 每个指标的进一步解释
- PDF 报告导出
- 雷达图 / 条形图 PNG 导出
- CSV / JSON / ZIP 完整数据导出
- Cloudflare Worker + KV 一次性访问码后台
- `admin.html` 管理页，可生成、导入、查看、导出访问码

> 本系统用于心理健康筛查与自我觉察，不构成医学诊断、治疗建议或危机干预服务。

---

## 文件结构

```text
.
├── index.html                  # 主测评页面
├── styles.css                  # 页面样式与响应式布局
├── app.js                      # 题库、评分、图表、报告导出和访问码逻辑
├── admin.html                  # 访问码管理页面
├── README.md                   # 英文 README
├── README_CN.md                # 中文 README
├── assets/
│   └── mindscope90-hero.svg    # README 标题图
└── worker/
    ├── worker.js               # Cloudflare Worker 一次性访问码后台
    └── wrangler.toml           # Worker 部署配置
```

---

## 评分说明

系统同时输出中文常用原始分指标和 SCL-90-R 国际常用总体指标。

| 指标 | 含义 |
| --- | --- |
| 总分 | 90 个题目原始分之和，采用 1–5 分体系。 |
| 总均分 | 总分除以 90。 |
| 阳性项目数 / PST | 原始分大于 1 的项目数量。 |
| GSI | Global Severity Index，将 1–5 分转换为 0–4 后计算总体严重度。 |
| PSDI | Positive Symptom Distress Index，阳性症状的平均强度。 |
| 因子分 | 某一维度内题目的平均分。 |

默认常用筛查规则在 `app.js` 中配置：

```js
screeningRules: {
  totalPositiveCutoff: 160,
  positiveItemCutoff: 43,
  factorMeanCutoff: 2
}
```

如果你有正式授权手册中的常模表、T 分转换表或行业机构要求，可继续把这些规则接入系统。

---

## 本地演示模式

默认是本地演示模式：

```js
const CONFIG = {
  accessMode: "local",
  localAccessCode: "CHANGE_ME_LOCAL_CODE"
};
```

这种模式只适合测试。因为纯前端访问码可以被懂技术的用户从源码中看到，不适合正式淘宝售卖。

---

## 一次性访问码模式

正式放到淘宝售卖时，建议改为服务端核销：

```js
const CONFIG = {
  accessMode: "api",
  apiBase: "https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev"
};
```

用户输入有效访问码后，后台会把该访问码标记为 `used`，同一个访问码不能再次使用。

---

## GitHub Pages 部署网页

1. 把以下文件上传到 GitHub 仓库根目录：

```text
index.html
styles.css
app.js
admin.html
README.md
README_CN.md
assets/
worker/
```

2. 进入 GitHub 仓库。
3. 打开 **Settings → Pages**。
4. `Source` 选择 `Deploy from a branch`。
5. `Branch` 选择 `main`，文件夹选择 `/root`。
6. 等待页面生成。

访问地址通常是：

```text
https://你的用户名.github.io/仓库名/
```

---

## 部署 Cloudflare Worker 访问码后台

### 1. 安装 Wrangler

```bash
npm install -g wrangler
wrangler login
```

### 2. 创建 KV 命名空间

```bash
cd worker
npx wrangler kv namespace create ACCESS_CODES
```

把生成的 namespace id 填入 `worker/wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "ACCESS_CODES"
id = "你的_KV_NAMESPACE_ID"
```

### 3. 设置后台管理员密钥

```bash
npx wrangler secret put ADMIN_TOKEN
```

这里输入一个只有你自己知道的强密码。`admin.html` 需要用它管理访问码。

### 4. 部署 Worker

```bash
npx wrangler deploy
```

部署成功后，把 Worker 地址填入 `app.js`：

```js
accessMode: "api",
apiBase: "https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev"
```

---

## 使用访问码管理页

打开：

```text
https://你的用户名.github.io/仓库名/admin.html
```

输入：

- Worker API 地址
- Admin Token

然后你可以：

- 生成访问码
- 导入访问码
- 查看有效访问码
- 查看已使用访问码
- 导出访问码 CSV

不要把 Admin Token 发给用户。

---

## 淘宝售卖流程

```text
用户在淘宝下单
↓
你在 admin.html 复制一个未使用访问码
↓
通过淘宝聊天发给用户
↓
用户扫码进入 GitHub Pages 测评页面
↓
输入访问码
↓
后台自动核销，该码变为已使用
↓
用户完成 SCL-90 测评并下载 PDF 报告
```

---

## 安全提示

如果用户报告中出现明显高困扰、自伤想法、伤人冲动、幻听/被控制感等高风险内容，系统会给出安全提示。该提示不能替代专业干预，用户应及时联系当地急救、精神科、心理危机干预资源或身边可信任的人。

---

## 授权与合规说明

本项目是技术实现包。题目内容、常模表、计分规则、商业使用权、专业使用要求和隐私合规义务，需要根据你自己的 SCL-90 授权文件和所在地监管要求处理。
