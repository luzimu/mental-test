<div align="center">
  <img src="assets/mindscope90-hero.svg" alt="MindScope 90 hero banner" width="100%" />

  # MindScope 90

  ### Smart Mental Health Self-Assessment Platform

  [English](README.md) · [简体中文](README_CN.md)

  <p>
    <img alt="Pure Frontend" src="https://img.shields.io/badge/Pure%20Frontend-HTML%20%7C%20CSS%20%7C%20JS-22D3EE?style=for-the-badge&labelColor=0F172A">
    <img alt="PDF Export" src="https://img.shields.io/badge/Export-PDF%20%7C%20PNG%20%7C%20CSV%20%7C%20JSON-A78BFA?style=for-the-badge&labelColor=0F172A">
    <img alt="No Backend" src="https://img.shields.io/badge/Backend-Not%20Required-34D399?style=for-the-badge&labelColor=0F172A">
    <img alt="GitHub Pages" src="https://img.shields.io/badge/Deploy-GitHub%20Pages-F8FAFC?style=for-the-badge&labelColor=0F172A&color=64748B">
  </p>

  **A polished, local-first, web-based psychological self-assessment experience with instant scoring, visual analytics, detailed dimension explanations, and downloadable reports.**

  [Live Demo](#live-demo) · [Features](#key-features) · [Quick Start](#quick-start) · [GitHub Pages](#deploy-to-github-pages) · [Commercial Notes](#commercial-use-notes)
</div>

---

## Overview

**MindScope 90** is a browser-based mental health self-assessment platform designed for lightweight online delivery, report generation, and commercial pilot testing. It provides a complete front-end experience: access-code entry, informed consent, 90-item assessment flow, automated scoring, visual charts, dimension-level interpretation, and multi-format export.

The project is intentionally built as a **static web app**. It can run locally, be deployed to GitHub Pages, or be embedded into a larger H5 / mini-program workflow later.

> **Important:** This project is a self-assessment and report-generation interface. It is not a medical diagnostic tool, not a clinical decision system, and not a substitute for qualified mental health professionals.

---

## Key Features

| Area | What it does |
| --- | --- |
| **Assessment Flow** | 90-item questionnaire experience with grouped dimensions, required-answer validation, progress tracking, and clean interaction design. |
| **Access Control** | Simple front-end access-code gate for demos, pilots, and manual paid distribution. |
| **Result Dashboard** | Total score, mean score, positive-item count, positive-symptom mean, dimension ranking, and visual summary. |
| **Dimension Explanations** | Each indicator includes an expandable explanation covering meaning, common signs, self-care suggestions, and when to seek professional help. |
| **Visual Analytics** | Radar chart and bar chart for quick comparison across dimensions. |
| **Report Export** | Download PDF report, chart PNG files, CSV result table, JSON raw data, and a complete ZIP export package. |
| **Local-first Privacy** | No server is required by default. The assessment can be completed and exported entirely in the user's browser. |
| **Deployment Ready** | Works with GitHub Pages, Cloudflare Pages, Netlify, Vercel static hosting, or any ordinary static web server. |

---

## Live Demo

After deploying this repository with GitHub Pages, your live URL will look like this:

```text
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

Example:

```text
https://luzimu.github.io/mental-test/
```

You can convert the final URL into a QR code and share it with users.

---

## Project Structure

```text
.
├── index.html              # Main assessment page
├── styles.css              # Visual design and responsive layout
├── app.js                  # Assessment logic, scoring, charts, exports
├── README.md               # English README
├── README_CN.md            # Chinese README
└── assets/
    └── mindscope90-hero.svg # README hero banner
```

---

## Quick Start

### 1. Download or clone the project

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
cd YOUR_REPOSITORY_NAME
```

### 2. Open locally

You can open the project directly in a browser:

```text
index.html
```

For a cleaner local preview, use any static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## Configuration

Open `app.js` and update the configuration block:

```js
const CONFIG = {
  appName: "MindScope 90",
  accessCode: "SCL2026"
};
```

For a paid or private pilot, replace `SCL2026` with your own access code.

> Front-end access codes are suitable for demos and low-risk manual sales only. For serious commercial use, use a server-side one-user-one-code verification system.

---

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `styles.css`, `app.js`, `README.md`, `README_CN.md`, and the `assets/` folder.
3. Go to **Settings → Pages**.
4. Set **Source** to `Deploy from a branch`.
5. Select branch `main` and folder `/root`.
6. Save and wait for the deployment URL.

Your site will usually be available within a few minutes.

---

## Report Exports

MindScope 90 supports multiple export formats:

- **PDF report**: full assessment summary and dimension explanations
- **Radar chart PNG**: visual comparison of all indicators
- **Bar chart PNG**: ranked dimension score view
- **CSV table**: dimension-level structured results
- **JSON file**: complete result object for future analysis
- **ZIP package**: all report data and visual assets in one archive

---

## Commercial Use Notes

This project is suitable for early-stage product validation, pilot distribution, and paid H5 testing. Recommended commercial workflow:

```text
User scans QR code
↓
User enters access code
↓
User completes the assessment
↓
System generates report
↓
User downloads PDF / charts / data package
```

For formal commercial operation, consider adding:

- Server-side order verification
- One-user-one-code access management
- Payment integration
- Report history storage
- Privacy policy and user agreement
- Data deletion mechanism
- Emergency support and professional referral notice
- Licensed scale content and validated scoring rules when using third-party psychological instruments

---

## Compliance & Safety Disclaimer

MindScope 90 is intended for psychological self-reflection, educational use, and non-diagnostic screening only. The generated result should not be interpreted as a medical diagnosis, treatment recommendation, or emergency intervention plan.

If a user reports severe distress, self-harm thoughts, or immediate danger, they should contact local emergency services or qualified mental health professionals immediately.

If you plan to commercialize a product based on a third-party psychological scale, verify the licensing, copyright, scoring rules, norms, and professional-use requirements before release.

---

## Roadmap

- [ ] Add bilingual UI switching inside the web app
- [ ] Add one-user-one-code backend verification
- [ ] Add order/payment integration
- [ ] Add report history and encrypted storage
- [ ] Add admin dashboard for access-code management
- [ ] Add mini-program version

---

## License

This repository is provided as a front-end assessment system template. Please choose an appropriate license before public release and ensure that any psychological scale content used in production is legally authorized.
