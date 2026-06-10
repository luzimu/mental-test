<div align="center">
  <img src="assets/mindscope90-hero.svg" alt="MindScope 90 标题图" width="100%" />

  # MindScope 90

  ### 智能心理健康自评平台

  [English](README.md) · [简体中文](README_CN.md)

  <p>
    <img alt="Pure Frontend" src="https://img.shields.io/badge/Pure%20Frontend-HTML%20%7C%20CSS%20%7C%20JS-22D3EE?style=for-the-badge&labelColor=0F172A">
    <img alt="PDF Export" src="https://img.shields.io/badge/Export-PDF%20%7C%20PNG%20%7C%20CSV%20%7C%20JSON-A78BFA?style=for-the-badge&labelColor=0F172A">
    <img alt="No Backend" src="https://img.shields.io/badge/Backend-Not%20Required-34D399?style=for-the-badge&labelColor=0F172A">
    <img alt="GitHub Pages" src="https://img.shields.io/badge/Deploy-GitHub%20Pages-F8FAFC?style=for-the-badge&labelColor=0F172A&color=64748B">
  </p>

  **一个本地优先的网页心理自评系统，支持即时评分、可视化分析、指标详细解释以及 PDF / PNG / CSV / JSON 报告导出。**

  [在线演示](#在线演示) · [功能特性](#功能特性) · [快速开始](#快速开始) · [GitHub-Pages-部署](#github-pages-部署) · [商业化说明](#商业化说明)
</div>

---

## 项目简介

**MindScope 90** 是一个浏览器端心理健康自评平台，适合用于 H5 测评页面、付费测评验证、报告生成和后续小程序迁移。系统包含访问码验证、知情同意、90 项测评流程、自动评分、图表展示、维度解释和多格式导出能力。

项目默认是**纯前端静态网页**，不依赖服务器、不依赖数据库，可以直接部署到 GitHub Pages，也可以后续迁移到国内 H5、小程序或带后端的正式商业系统。

> **重要提示：** 本系统仅用于心理自评、科普展示和非诊断性筛查，不构成医学诊断、治疗建议或危机干预服务。

---

## 功能特性

| 功能 | 说明 |
| --- | --- |
| **测评流程** | 90 项问卷、进度展示、必答校验、分组评分和完整交互流程。 |
| **访问控制** | 支持简单前端访问码，适合演示、内测和人工售卖。 |
| **结果面板** | 展示总分、总均分、阳性项目数、阳性症状均分和维度排序。 |
| **指标解释** | 每个指标支持进一步解释，包括指标含义、常见表现、自我调节建议和专业帮助提示。 |
| **图表分析** | 支持雷达图和条形图，直观展示各维度状态。 |
| **报告导出** | 支持 PDF 报告、PNG 图表、CSV 结果表、JSON 原始数据和 ZIP 总包下载。 |
| **本地优先** | 默认不上传用户数据，全部在浏览器本地完成计算与报告生成。 |
| **部署友好** | 可部署到 GitHub Pages、Cloudflare Pages、Netlify、Vercel 或任意静态网站服务。 |

---

## 在线演示

部署到 GitHub Pages 后，访问地址通常类似：

```text
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

示例：

```text
https://luzimu.github.io/mental-test/
```

你可以将该网址生成二维码，用于用户扫码访问。

---

## 项目结构

```text
.
├── index.html              # 主测评页面
├── styles.css              # 页面样式与响应式布局
├── app.js                  # 测评逻辑、评分、图表和导出
├── README.md               # 英文 README
├── README_CN.md            # 中文 README
└── assets/
    └── mindscope90-hero.svg # README 标题图
```

---

## 快速开始

### 1. 下载或克隆项目

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
cd YOUR_REPOSITORY_NAME
```

### 2. 本地打开

可以直接双击打开：

```text
index.html
```

也可以用本地静态服务预览：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

---

## 配置访问码

打开 `app.js`，修改配置项：

```js
const CONFIG = {
  appName: "MindScope 90",
  accessCode: "SCL2026"
};
```

正式售卖前，把 `SCL2026` 改成你自己的访问码。

> 纯前端访问码只适合演示和低风险内测。如果正式商业化，建议接入服务端的一人一码核销系统。

---

## GitHub Pages 部署

1. 新建 GitHub 仓库。
2. 上传 `index.html`、`styles.css`、`app.js`、`README.md`、`README_CN.md` 和 `assets/` 文件夹。
3. 进入 **Settings → Pages**。
4. `Source` 选择 `Deploy from a branch`。
5. `Branch` 选择 `main`，文件夹选择 `/root`。
6. 保存后等待部署地址生成。

---

## 商业化说明

推荐的早期商业化流程：

```text
用户扫码进入页面
↓
输入访问码
↓
完成心理自评
↓
生成结果报告
↓
下载 PDF / 图表 / 数据包
```

正式商业化时，建议补充：

- 服务端订单验证
- 一人一码管理
- 支付接口
- 报告历史记录
- 隐私政策和用户协议
- 用户数据删除机制
- 危机提示与专业转介说明
- 如使用第三方心理量表，需确认题项、评分规则、常模和商用授权

---

## 安全与合规声明

MindScope 90 仅用于心理健康自评、教育展示和非诊断性筛查，不构成医学诊断、治疗建议或危机干预服务。

如果用户存在严重痛苦、自伤想法或现实危险，应立即联系当地急救服务或专业心理健康服务人员。

如果你计划基于第三方心理量表进行商业化发布，请在上线前确认量表版权、授权范围、计分规则、常模资料和专业使用要求。
