/**
 * SCL-90 症状自评量表前端系统（授权题库版）
 * ------------------------------------------------------
 * 说明：本版本已替换为用户提供并声明已获得正规授权的 SCL-90 中文题项。
 * 评分同时输出中文 1-5 原始分体系与国际常用 0-4 转换指标：GSI、PST、PSDI。
 * 本系统用于心理健康筛查与自我觉察，不构成医学诊断、治疗建议或危机干预。
 */

const CONFIG = {
  appName: "SCL-90 症状自评量表",
  // GitHub Pages 只能托管静态页面，无法安全实现“一码一次”。
  // 正式淘宝售卖请将 accessMode 设为 "api"，并把 apiBase 改成 Cloudflare Worker 地址。
  accessMode: "local", // "local" 用于本地演示；"api" 用于服务端一次性核销
  localAccessCode: "CHANGE_ME_LOCAL_CODE",
  apiBase: "https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev",
  pageSize: 10,
  scaleMin: 1,
  scaleMax: 5,
  normalizedScaleMax: 4,
  optionLabels: [
    { value: 1, label: "没有", desc: "1" },
    { value: 2, label: "很轻", desc: "2" },
    { value: 3, label: "中等", desc: "3" },
    { value: 4, label: "偏重", desc: "4" },
    { value: 5, label: "严重", desc: "5" }
  ],
  screeningRules: {
    totalPositiveCutoff: 160,
    positiveItemCutoff: 43,
    factorMeanCutoff: 2
  }
};

const DIMENSIONS = [
  { key: "som", name: "躯体化", short: "躯体" },
  { key: "ocd", name: "强迫症状", short: "强迫" },
  { key: "inter", name: "人际关系敏感", short: "人际" },
  { key: "dep", name: "抑郁", short: "抑郁" },
  { key: "anx", name: "焦虑", short: "焦虑" },
  { key: "host", name: "敌对", short: "敌对" },
  { key: "phob", name: "恐怖", short: "恐怖" },
  { key: "para", name: "偏执", short: "偏执" },
  { key: "psy", name: "精神病性", short: "精神性" },
  { key: "other", name: "其他（睡眠/饮食）", short: "其他" }
];

const DIMENSION_ITEM_MAP = {
  som: [1, 4, 12, 27, 40, 42, 48, 49, 52, 53, 56, 58],
  ocd: [3, 9, 10, 28, 38, 45, 46, 51, 55, 65],
  inter: [6, 21, 34, 36, 37, 41, 61, 69, 73],
  dep: [5, 14, 15, 20, 22, 26, 29, 30, 31, 32, 54, 71, 79],
  anx: [2, 17, 23, 33, 39, 57, 72, 78, 80, 86],
  host: [11, 24, 63, 67, 74, 81],
  phob: [13, 25, 47, 50, 70, 75, 82],
  para: [8, 18, 43, 68, 76, 83],
  psy: [7, 16, 35, 62, 77, 84, 85, 87, 88, 90],
  other: [19, 44, 59, 60, 64, 66, 89]
};

function findDimensionKey(itemId) {
  for (const [key, ids] of Object.entries(DIMENSION_ITEM_MAP)) {
    if (ids.includes(itemId)) return key;
  }
  return "other";
}

const DIMENSION_EXPLANATIONS = {
  som: {
    meaning: "该因子反映个体在近一周内体验到的身体化不适程度，包括疼痛、胸闷、胃肠不适、发麻、无力、冷热感等。临床解释时需要同时考虑真实躯体疾病、睡眠不足、压力反应和焦虑相关躯体唤醒。",
    signs: "常见表现包括反复关注身体感受、身体不适影响工作学习、检查后仍担心健康问题，或在压力增大时身体症状明显加重。",
    advice: "建议记录症状出现时间、持续时间、压力事件和睡眠情况；保持规律作息、适度运动和医学必要检查。若医学检查无明显异常但困扰持续，可考虑心理压力管理或心理咨询。",
    help: "如胸痛、呼吸困难、昏倒、持续疼痛等症状明显，应优先就医；若身体不适与焦虑、恐惧或长期压力高度相关，也建议进行专业心理评估。"
  },
  ocd: {
    meaning: "该因子反映强迫性思维和强迫性行为倾向，包括反复想法、反复检查、难以决策、过度追求准确与确定性等。高分通常提示心理资源被重复确认和内在冲突消耗。",
    signs: "常见表现包括反复检查、做事很慢以确保正确、脑中有不必要想法盘旋、难以停止某个念头、必须重复清洗或计数。",
    advice: "可尝试设定检查次数上限，用清单替代反复确认，逐步练习容忍不确定性，并将任务拆分为明确可完成的小步骤。",
    help: "若重复想法或行为明显占用时间、造成痛苦，或影响学习、工作、人际关系，建议寻求临床心理师或精神科医生评估。"
  },
  inter: {
    meaning: "该因子反映在人际互动中对评价、拒绝、比较和关系安全感的敏感程度。高分常与自我价值感波动、社交压力、羞怯感和被误解感相关。",
    signs: "常见表现包括同异性相处不自在、容易受伤、感觉别人不理解或不喜欢自己、在人群中被关注时紧张、公共场合吃东西不舒服。",
    advice: "建议区分事实与推测，减少对他人表情和语气的过度解读；从低压力社交场景开始练习表达、边界和自我接纳。",
    help: "若人际敏感导致长期回避社交、亲密关系受损、明显孤立或价值感下降，建议进行专业心理咨询。"
  },
  dep: {
    meaning: "该因子反映抑郁相关体验，包括兴趣下降、精力下降、无望感、自责、自我价值下降、孤独和悲伤等。高分提示需要重点关注情绪、功能和安全风险，但不能单独作为抑郁症诊断。",
    signs: "常见表现包括容易哭泣、对事物不感兴趣、感到孤独苦闷、前途无望、觉得自己没有价值、经常责怪自己或认为自己应受惩罚。",
    advice: "建议先恢复基础节律：固定起床时间、轻量运动、减少独处、建立日常任务清单，并尽量与可信任的人保持联系。",
    help: "若低落、无望或自责持续两周以上，或出现结束生命、死亡相关想法，应立即联系身边可信任的人和专业危机干预/医疗资源。"
  },
  anx: {
    meaning: "该因子反映焦虑和高唤醒状态，包括紧张、害怕、惊恐、心跳加快、发抖、坐立不安等。高分提示个体近期压力系统可能处于持续警觉状态。",
    signs: "常见表现包括神经过敏、心中不踏实、突然害怕、过分担忧、心跳厉害、紧张或容易紧张、坐立不安。",
    advice: "建议练习腹式呼吸、渐进式肌肉放松和正念 grounding；把担忧写成具体问题，区分可控制事项与不可控制事项。",
    help: "若焦虑伴随惊恐发作、持续失眠、明显回避或功能受损，建议寻求专业心理治疗或精神科评估。"
  },
  host: {
    meaning: "该因子反映烦躁、愤怒、冲动、争论和攻击性表达倾向。高分常与长期压力、睡眠不足、挫败感和关系冲突有关。",
    signs: "常见表现包括容易激动、不能控制地大发脾气、想打人或伤害他人、想摔坏东西、经常与人争论、大叫或摔东西。",
    advice: "建议在冲突中先暂停回应，采用离开现场、深呼吸、运动释放和延迟表达；事后用文字梳理愤怒背后的需求、边界和事实。",
    help: "若出现伤害自己或他人的冲动、破坏行为或失控风险，应立即寻求现实支持和专业帮助。"
  },
  phob: {
    meaning: "该因子反映对特定场所、交通工具、独处、公共场合或人多环境的恐惧与回避。高分提示回避行为可能正在限制生活半径和功能。",
    signs: "常见表现包括害怕空旷场所或街道、怕单独出门、怕乘公共交通、因害怕而避开某些活动、在人多场所不自在、害怕公共场合昏倒。",
    advice: "建议建立分级暴露清单，从低强度场景开始逐步练习；避免一次性强迫暴露，也避免长期完全回避。",
    help: "若恐惧导致无法正常上班、上学、出行、购物或社交，建议进行专业心理治疗或精神科评估。"
  },
  para: {
    meaning: "该因子反映怀疑、防备、被针对感和对他人意图的负面解释倾向。高分时，个体可能更容易把模糊信息解释为敌意、利用或不公。",
    signs: "常见表现包括责怪别人制造麻烦、感到大多数人不可信、感到有人监视或谈论自己、认为别人没有恰当评价自己、感到别人想占便宜。",
    advice: "建议把判断分为事实、推测和证据三栏；在做出负面结论前延迟反应，并通过可信任关系进行现实检验。",
    help: "若怀疑感强烈、持续，造成严重人际冲突、睡眠受损或工作学习明显受影响，建议进行专业评估。"
  },
  psy: {
    meaning: "该因子反映疏离感、现实感变化、异常知觉体验、被控制感、思维边界感和明显孤立等内容。该因子需要谨慎解释，自评高分只提示进一步评估必要性，不能直接推断精神障碍。",
    signs: "常见表现包括听到旁人听不到的声音、感到别人能控制思想、觉得旁人知道私下想法、有不属于自己的想法、熟悉事物变陌生、从未感到与他人亲近。",
    advice: "建议减少熬夜、酒精和高压力刺激，保持稳定作息，记录异常体验的时间、诱因、持续时长和影响。",
    help: "若出现明显幻听、被控制感、现实感严重受损、行为混乱或无法维持基本功能，应尽快联系精神科或急诊资源。"
  },
  other: {
    meaning: "该因子包括睡眠、饮食、死亡相关想法和罪责感等附加项目，常用于辅助理解总体心理压力和生活节律受损情况。它不是单一疾病维度，但对风险识别很重要。",
    signs: "常见表现包括胃口不好、难以入睡、早醒、睡得不稳、吃得太多、想到死亡、感到有罪。",
    advice: "建议优先稳定睡眠与饮食节律，减少睡前刺激，建立固定起床时间，并记录情绪、睡眠和饮食变化。",
    help: "若死亡相关想法、严重失眠、食欲显著改变或罪责感持续存在，应尽快寻求专业支持。"
  }
};

const SCL90_ITEMS = [
  { id: 1, text: "头痛" },
  { id: 2, text: "神经过敏，心中不踏实" },
  { id: 3, text: "头脑中有不必要的想法或字句盘旋" },
  { id: 4, text: "头昏或昏倒" },
  { id: 5, text: "对异性的兴趣减退" },
  { id: 6, text: "对旁人责备求全" },
  { id: 7, text: "感到别人能控制你的思想" },
  { id: 8, text: "责怪别人制造麻烦" },
  { id: 9, text: "忘记性大" },
  { id: 10, text: "担心自己的衣饰整齐及仪态的端正" },
  { id: 11, text: "容易烦恼和激动" },
  { id: 12, text: "胸痛" },
  { id: 13, text: "害怕空旷的场所或街道" },
  { id: 14, text: "感到自己的精力下降，活动减慢" },
  { id: 15, text: "想结束自己的生命" },
  { id: 16, text: "听到旁人听不到的声音" },
  { id: 17, text: "发抖" },
  { id: 18, text: "感到大多数人都不可信任" },
  { id: 19, text: "胃口不好" },
  { id: 20, text: "容易哭泣" },
  { id: 21, text: "同异性相处时感到害羞不自在" },
  { id: 22, text: "感到受骗，中了圈套或有人想抓您" },
  { id: 23, text: "无缘无故地突然感到害怕" },
  { id: 24, text: "自己不能控制地大发脾气" },
  { id: 25, text: "怕单独出门" },
  { id: 26, text: "经常责怪自己" },
  { id: 27, text: "腰痛" },
  { id: 28, text: "感到难以完成任务" },
  { id: 29, text: "感到孤独" },
  { id: 30, text: "感到苦闷" },
  { id: 31, text: "过分担忧" },
  { id: 32, text: "对事物不感兴趣" },
  { id: 33, text: "感到害怕" },
  { id: 34, text: "我的感情容易受到伤害" },
  { id: 35, text: "旁人能知道您的私下想法" },
  { id: 36, text: "感到别人不理解您不同情您" },
  { id: 37, text: "感到人们对你不友好，不喜欢你" },
  { id: 38, text: "做事必须做得很慢以保证做得正确" },
  { id: 39, text: "心跳得很厉害" },
  { id: 40, text: "恶心或胃部不舒服" },
  { id: 41, text: "感到比不上他人" },
  { id: 42, text: "肌肉酸痛" },
  { id: 43, text: "感到有人在监视您谈论您" },
  { id: 44, text: "难以入睡" },
  { id: 45, text: "做事必须反复检查" },
  { id: 46, text: "难以作出决定" },
  { id: 47, text: "怕乘电车、公共汽车、地铁或火车" },
  { id: 48, text: "呼吸有困难" },
  { id: 49, text: "一阵阵发冷或发热" },
  { id: 50, text: "因为感到害怕而避开某些东西，场合或活动" },
  { id: 51, text: "脑子变空了" },
  { id: 52, text: "身体发麻或刺痛" },
  { id: 53, text: "喉咙有梗塞感" },
  { id: 54, text: "感到对前途没有希望" },
  { id: 55, text: "不能集中注意力" },
  { id: 56, text: "感到身体的某一部分软弱无力" },
  { id: 57, text: "感到紧张或容易紧张" },
  { id: 58, text: "感到手或脚发沉" },
  { id: 59, text: "想到有关死亡的事" },
  { id: 60, text: "吃得太多" },
  { id: 61, text: "当别人看着您或谈论您时感到不自在" },
  { id: 62, text: "有一些不属于您自己的想法" },
  { id: 63, text: "有想打人或伤害他人的冲动" },
  { id: 64, text: "醒得太早" },
  { id: 65, text: "必须反复洗手、点数目或触摸某些东西" },
  { id: 66, text: "睡得不稳不深" },
  { id: 67, text: "有想摔坏或破坏东西的冲动" },
  { id: 68, text: "有一些别人没有的想法或念头" },
  { id: 69, text: "感到对别人神经过敏" },
  { id: 70, text: "在商店或电影院等人多的地方感到不自在" },
  { id: 71, text: "感到任何事情都很难做" },
  { id: 72, text: "一阵阵恐惧或惊恐" },
  { id: 73, text: "感到在公共场合吃东西很不舒服" },
  { id: 74, text: "经常与人争论" },
  { id: 75, text: "单独一人时神经很紧张" },
  { id: 76, text: "别人对您的成绩没有作出恰当的评价" },
  { id: 77, text: "即使和别人在一起也感到孤单" },
  { id: 78, text: "感到坐立不安心神不宁" },
  { id: 79, text: "感到自己没有什么价值" },
  { id: 80, text: "感到熟悉的东西变成陌生或不象是真的" },
  { id: 81, text: "大叫或摔东西" },
  { id: 82, text: "害怕会在公共场合昏倒" },
  { id: 83, text: "感到别人想占您的便宜" },
  { id: 84, text: "为一些有关“性”的想法而很苦恼" },
  { id: 85, text: "认为应该因为自己的过错而受到惩罚" },
  { id: 86, text: "感到要赶快把事情做完" },
  { id: 87, text: "感到自己的身体有严重问题" },
  { id: 88, text: "从未感到和其他人很亲近" },
  { id: 89, text: "感到自己有罪" },
  { id: 90, text: "感到自己的脑子有毛病" }
];

const QUESTIONS = SCL90_ITEMS.map((q) => ({
  ...q,
  dim: findDimensionKey(q.id)
}));

const CRISIS_ITEMS = [
  { id: 15, threshold: 2, label: "自杀/结束生命相关想法" },
  { id: 59, threshold: 4, label: "死亡相关想法较重" },
  { id: 63, threshold: 3, label: "伤害他人冲动" },
  { id: 67, threshold: 3, label: "破坏冲动" },
  { id: 81, threshold: 3, label: "失控性表达/摔东西" }
];

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
  // 中文 1-5 分体系：1=没有，5=严重；阳性项目通常按原始分 > 1 计算。
  // 国际常用 0-4 指标体系：normalized = raw - 1；GSI = normalizedTotal / 90；PST = normalized > 0 的项目数；PSDI = normalizedTotal / PST。
  const rawScores = QUESTIONS.map((q) => Number(state.answers[q.id] ?? 0));
  const normScores = rawScores.map((s) => Math.max(0, s - 1));
  const total = rawScores.reduce((a, b) => a + b, 0);
  const mean = total / QUESTIONS.length;
  const normalizedTotal = normScores.reduce((a, b) => a + b, 0);
  const gsi = normalizedTotal / QUESTIONS.length;
  const positiveScores = rawScores.filter((s) => s > 1);
  const positiveCount = positiveScores.length; // PST in the 0-4 framework
  const pst = positiveCount;
  const psdi = positiveCount ? normalizedTotal / positiveCount : 0;

  const dimensions = DIMENSIONS.map((dim) => {
    const qs = QUESTIONS.filter((q) => q.dim === dim.key);
    const rawValues = qs.map((q) => Number(state.answers[q.id] ?? 0));
    const normValues = rawValues.map((v) => Math.max(0, v - 1));
    const sum = rawValues.reduce((a, b) => a + b, 0);
    const normSum = normValues.reduce((a, b) => a + b, 0);
    return {
      ...dim,
      count: rawValues.length,
      sum,
      mean: sum / rawValues.length,
      normSum,
      normMean: normSum / normValues.length,
      positiveCount: rawValues.filter((v) => v > 1).length
    };
  }).sort((a, b) => b.mean - a.mean);

  const chineseScreenPositive = total >= CONFIG.screeningRules.totalPositiveCutoff || positiveCount >= CONFIG.screeningRules.positiveItemCutoff || dimensions.some((d) => d.mean >= CONFIG.screeningRules.factorMeanCutoff);

  return { total, mean, normalizedTotal, gsi, pst, positiveCount, psdi, dimensions, chineseScreenPositive };
}

function getRisk(mean) {
  // mean 为中文原始均分，1-5；同时报告中展示 GSI/PST/PSDI。
  if (mean < 2) return { label: "总体低风险", cls: "risk-low", description: "当前总体症状负担较低，建议保持规律作息、运动和稳定社交支持。" };
  if (mean < 3) return { label: "轻度至中度风险", cls: "risk-mid", description: "当前存在一定心理困扰，建议关注压力来源，尝试睡眠、运动、情绪记录等自我调节方式。" };
  if (mean < 4) return { label: "中度至偏高风险", cls: "risk-high", description: "当前困扰水平较明显，建议尽快寻求专业心理咨询、精神科或校企心理服务支持。" };
  return { label: "高风险提示", cls: "risk-high", description: "当前困扰水平较高，建议优先联系专业人员进行进一步评估；若伴随危机想法，请立即寻求线下帮助。" };
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
  if (mean < 2) return { label: "低水平", cls: "level-low", text: "该维度困扰较低，当前未表现为主要压力来源。" };
  if (mean < 3) return { label: "轻度", cls: "level-mid", text: "该维度存在一定困扰，建议持续观察并进行生活方式调整。" };
  if (mean < 4) return { label: "中度", cls: "level-high", text: "该维度困扰较明显，建议结合现实压力源进行重点关注。" };
  return { label: "偏重/较高", cls: "level-high", text: "该维度困扰较高，若持续存在或影响功能，建议寻求专业评估。" };
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
    `阳性项目数/PST：${result.positiveCount}`,
    `GSI（0-4总体严重度）：${result.gsi.toFixed(2)}`,
    `PSDI（阳性症状强度）：${result.psdi.toFixed(2)}`,
    `常用筛查规则提示：${result.chineseScreenPositive ? "达到进一步关注标准" : "未达到常用阳性筛查标准"}`,
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
      normalizedMean: Number(dim.normMean.toFixed(4)),
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
      pst: state.lastResult.pst,
      normalizedTotal: state.lastResult.normalizedTotal,
      gsi: Number(state.lastResult.gsi.toFixed(4)),
      psdi: Number(state.lastResult.psdi.toFixed(4)),
      chineseScreenPositive: state.lastResult.chineseScreenPositive,
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
  if ($("gsiScore")) $("gsiScore").textContent = result.gsi.toFixed(2);
  if ($("pstScore")) $("pstScore").textContent = result.pst;
  if ($("screeningFlag")) $("screeningFlag").textContent = result.chineseScreenPositive ? "需关注" : "未触发";

  const orderedForRadar = DIMENSIONS.map((dim) => result.dimensions.find((d) => d.key === dim.key));
  renderRadar(orderedForRadar);
  renderBarChart(result.dimensions);
  renderDimensionDetails(result.dimensions);

  const top3 = result.dimensions.slice(0, 3);
  const triggeredCrisis = CRISIS_ITEMS.filter((item) => Number(state.answers[item.id] || 0) >= item.threshold);
  if ($("crisisWarning")) {
    $("crisisWarning").style.display = triggeredCrisis.length ? "block" : "none";
    $("crisisWarning").textContent = triggeredCrisis.length ? `安全风险提示：检测到 ${triggeredCrisis.map((i) => i.label).join("、")}。请优先联系现实中的可信任人员、当地急救或专业心理危机资源。` : "";
  }
  $("interpretation").textContent = `${risk.description} 本次总分 ${result.total}，GSI ${result.gsi.toFixed(2)}，PST ${result.pst}，PSDI ${result.psdi.toFixed(2)}；常用筛查规则显示：${result.chineseScreenPositive ? "建议进一步关注或评估" : "暂未触发阳性筛查阈值"}。当前相对突出的维度为：${top3.map((d) => `${d.name}（均分 ${d.mean.toFixed(2)}）`).join("、")}。请把该结果理解为自我观察线索，而不是疾病标签。若困扰持续两周以上、明显影响工作学习或关系，建议预约专业人员进一步评估。`;
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

function isApiConfigured() {
  return CONFIG.accessMode === "api" && CONFIG.apiBase && !CONFIG.apiBase.includes("YOUR-WORKER-NAME");
}

async function redeemAccessCode(code) {
  if (!isApiConfigured()) {
    if (code !== CONFIG.localAccessCode) {
      return { ok: false, message: "访问码不正确，请重新输入" };
    }
    return { ok: true, sessionToken: "LOCAL-DEMO-SESSION" };
  }
  const res = await fetch(`${CONFIG.apiBase.replace(/\/$/, "")}/api/redeem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  });
  let data = {};
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok || !data.ok) return { ok: false, message: data.message || "访问码验证失败" };
  return data;
}

$("verifyForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const code = $("accessCode").value.trim();
  if (!code) {
    toast("请输入访问码");
    return;
  }
  const submitBtn = event.target.querySelector("button[type='submit']");
  const oldText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "验证中...";
  try {
    const result = await redeemAccessCode(code);
    if (!result.ok) {
      toast(result.message || "访问码不正确或已使用");
      return;
    }
    sessionStorage.setItem("scl90_session_token", result.sessionToken || "");
    sessionStorage.setItem("scl90_access_code_mask", code.slice(0, 4) + "****");
    toast(isApiConfigured() ? "验证成功，访问码已核销" : "本地演示验证成功");
    showView("consentView");
  } catch (err) {
    console.error(err);
    toast("无法连接访问码服务器，请检查网络或后台配置");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = oldText;
  }
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
