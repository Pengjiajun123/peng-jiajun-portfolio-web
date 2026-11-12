'use strict';

(() => {
  const projects = {
    cyanotype: { title: '晒一晒，蓝色的秘密', category: '01 / 儿童绘本 · 文创延展', pages: [3, 4, 5], description: '以蓝晒工艺为线索，跟随蓝蓝和奶奶走进一个关于时间、阳光与印记的世界。涵盖角色设定、16P 绘本页面、装帧效果与文创周边。' },
    porcelain: { title: '瓷韵纹心', category: '02 / 传统纹样 · 品牌与包装', pages: [6, 7, 8], description: '以四件雍乾御窑器物为研究起点，提取缠枝纹的 S 形骨骼与层叠色值，延展为标志、连续纹样、海报、包装、IP 与空间应用。' },
    'daily-ai': { title: '日常生活的数字帮手', category: '03 / 穿搭 Agent · 生活费记账', pages: [9], description: '《猪妞穿搭》大学生穿衣 Agent 与大学生生活费记账应用的界面展示。原作品集中标注记账微信小程序已上线；本页展示所收录的设计稿。' },
    campus: { title: '校园情报局 Campus Intel', category: '04 / 校园信息 · AI 产品', pages: [10], description: '面向大学生高频校园信息场景，将课程群、班群、社团群、比赛通知和活动海报中的碎片信息，转化为情报卡片、今日必办、风险提醒和 AI 行动建议。' },
    home: { title: '家', category: '05 / 中国美术史 · 交互设计', pages: [11], description: '中国美术史交互作品《家》，以电脑端与页面展示呈现作品的视觉与交互表达。' },
    unity: { title: '光与空间的实验', category: '06 / UNITY 场景特效设计', pages: [12], description: 'Unity 场景特效作品，展示实时环境中的灯光、视觉效果与空间氛围。' },
    factory: { title: '废弃工厂', category: '07 / 环境与地图设计', pages: [13], description: '废弃工厂地图。通过不同视角展示工业空间、构件材质与光照形成的场景氛围。' },
    mars: { title: '火星', category: '08 / 环境与地图设计', pages: [14], description: '火星地图。以红色地表、基地设施与通讯天线构建外星环境。' },
    village: { title: '乡村', category: '09 / 环境与地图设计', pages: [15], description: '乡村地图。通过木屋、道路、栅栏与植被组织场景的层次和氛围。' },
    archive: { title: '完整作品集', category: 'ARCHIVE / 16 页原始作品', pages: Array.from({ length: 16 }, (_, i) => i + 1), description: '按原始顺序翻阅封面、个人介绍、全部项目和结束页。网页图片保留原版式，亦可打开或下载完整 PDF。' }
  };
  const pageTitles = ['作品集封面', '个人介绍与目录', '蓝晒绘本封面', '角色设定与内页展示', '绘本效果与文创周边', '瓷韵纹心项目介绍', '实物研究、标志与纹样', '海报、包装与场景应用', '穿搭 Agent 与生活费记账', '校园情报局 Campus Intel', '中国美术史交互作品《家》', 'Unity 场景特效', '废弃工厂地图', '火星地图', '乡村地图', '结束页与联系信息'];
  const filters = document.querySelector('.filters');
  const cards = [...document.querySelectorAll('.project-card')];
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    for (const option of filters.querySelectorAll('button')) option.setAttribute('aria-pressed', String(option === button));
    let count = 0;
    for (const card of cards) {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) count++;
    }
    document.getElementById('visible-count').textContent = String(count).padStart(2, '0');
  });

  const dialog = document.getElementById('project-dialog');
  if (typeof dialog.showModal !== 'function') return;
  const stage = document.getElementById('viewer-stage');
  const image = document.getElementById('viewer-image');
  const zoom = document.getElementById('zoom-page');
  const previous = document.getElementById('previous-page');
  const next = document.getElementById('next-page');
  const imageError = dialog.querySelector('.image-error');
  let activeProject = null;
  let pageIndex = 0;
  let returnFocus = null;

  function resetZoom() {
    stage.classList.remove('is-zoomed');
    zoom.setAttribute('aria-pressed', 'false');
    zoom.innerHTML = '放大细节 <span aria-hidden="true">＋</span>';
    stage.scrollTo(0, 0);
  }
  function renderPage() {
    resetZoom();
    const number = activeProject.pages[pageIndex];
    const file = `page-${String(number).padStart(2, '0')}.webp`;
    imageError.hidden = true;
    image.hidden = false;
    image.src = file;
    image.alt = `原作品集第 ${number} 页：${pageTitles[number - 1]}`;
    // Each image keeps its own original aspect ratio, including portrait covers.
    image.removeAttribute('width');
    image.removeAttribute('height');
    document.getElementById('page-position').textContent = `${pageIndex + 1} / ${activeProject.pages.length} · 原稿 P${number}`;
    document.getElementById('dialog-pdf').href = `peng-jiajun-portfolio.pdf#page=${number}`;
    previous.disabled = pageIndex === 0;
    next.disabled = pageIndex === activeProject.pages.length - 1;
    if (pageIndex + 1 < activeProject.pages.length) {
      const preload = new Image();
      preload.src = `page-${String(activeProject.pages[pageIndex + 1]).padStart(2, '0')}.webp`;
    }
  }
  image.addEventListener('error', () => { image.hidden = true; imageError.hidden = false; });
  function openProject(key, trigger) {
    activeProject = projects[key];
    if (!activeProject) return;
    pageIndex = 0;
    returnFocus = trigger;
    document.getElementById('dialog-title').textContent = activeProject.title;
    document.getElementById('dialog-category').textContent = activeProject.category;
    document.getElementById('dialog-description').textContent = activeProject.description;
    renderPage();
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
    dialog.querySelector('.close-dialog').focus();
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-project]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openProject(link.dataset.project, link);
  });
  function step(direction) {
    const index = pageIndex + direction;
    if (index >= 0 && index < activeProject.pages.length) { pageIndex = index; renderPage(); }
  }
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    resetZoom();
    returnFocus?.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (stage.classList.contains('is-zoomed')) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
  });
  zoom.addEventListener('click', () => {
    const zoomed = stage.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed', String(zoomed));
    zoom.innerHTML = zoomed ? '适应页面 <span aria-hidden="true">－</span>' : '放大细节 <span aria-hidden="true">＋</span>';
    stage.scrollTo(0, 0);
  });
})();
