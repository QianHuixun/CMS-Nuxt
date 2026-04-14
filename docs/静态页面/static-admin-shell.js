const STATIC_PAGE_MAP = {
  首页: "后台静态页面导航.html",
  导航配置: "系统基础配置管理-导航配置.html",
  屏保配置: "系统基础配置管理-屏保配置.html",
  资源录入: "资源导航管理-资源录入.html",
  卡片管理: "资源导航管理-卡片管理.html",
  人才管理: "人才与对应科研管理-人才管理.html",
  数据导入: "论文著作与成果管理-数据导入.html",
  书籍仿真录入: "论文著作与成果管理-书籍仿真录入.html",
  词云: "自动化辅助功能-词云.html",
  图表生成: "自动化辅助功能-图表生成.html",
  沉浸式编辑: "活动管理-沉浸式编辑.html",
  头条精选: "活动管理-头条精选.html"
};

const STATIC_MENU = [
  {
    parent: "系统基础配置管理",
    children: ["导航配置", "屏保配置"]
  },
  {
    parent: "资源导航管理",
    children: ["资源录入", "卡片管理"]
  },
  {
    parent: "人才与对应科研管理",
    children: ["人才管理"]
  },
  {
    parent: "论文著作与成果管理",
    children: ["数据导入", "书籍仿真录入"]
  },
  {
    parent: "自动化辅助功能",
    children: ["词云", "图表生成"]
  },
  {
    parent: "活动管理",
    children: ["沉浸式编辑", "头条精选"]
  }
];

const PARENT_ICON = {
  系统基础配置管理:
    '<svg viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="M10.5 3h3l.7 2.3a7.4 7.4 0 0 1 1.75.73l2.17-1.03 2.12 2.12-1.03 2.17c.3.56.54 1.15.73 1.75L22 10.5v3l-2.3.7a7.4 7.4 0 0 1-.73 1.75l1.03 2.17-2.12 2.12-2.17-1.03a7.4 7.4 0 0 1-1.75.73L13.5 22h-3l-.7-2.3a7.4 7.4 0 0 1-1.75-.73l-2.17 1.03-2.12-2.12 1.03-2.17a7.4 7.4 0 0 1-.73-1.75L2 13.5v-3l2.3-.7c.16-.6.4-1.19.73-1.75L4 5.88l2.12-2.12 2.17 1.03c.56-.3 1.15-.54 1.75-.73L10.5 3Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="1.5"/></svg>',
  资源导航管理:
    '<svg viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="m4 12 15-7-4.5 14-3.1-5.4L4 12Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="m11.4 13.6 3.6-3.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  人才与对应科研管理:
    '<svg viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="M15.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" stroke="currentColor" stroke-width="1.5"/><path d="M4.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M17 10.5a2.5 2.5 0 1 0 0-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18.5 19a4 4 0 0 0-2.5-3.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  论文著作与成果管理:
    '<svg viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="M7 3.75h8.5L20 8.25V20.5a.75.75 0 0 1-.75.75H7a3 3 0 0 1-3-3V6.75A3 3 0 0 1 7 3.75Z" stroke="currentColor" stroke-width="1.5"/><path d="M15.5 3.75V8.5H20" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 12.5h7M8.5 16h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  自动化辅助功能:
    '<svg viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="M6 19V9m6 10V5m6 14v-7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M4 19.5h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  活动管理:
    '<svg viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.92 1.06-6.2L3 9.53l6.22-.9L12 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'
};

function navHref(label) {
  return STATIC_PAGE_MAP[label] || "#";
}

function toneClasses(tone) {
  const tones = {
    sky: "bg-sky-50 text-sky-700 ring-sky-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200"
  };
  return tones[tone] || tones.slate;
}

function renderMenu(activeParent, activeChild) {
  return STATIC_MENU.map(section => {
    const active = section.parent === activeParent;
    const children = active
      ? `<div class="mt-2 space-y-1 pl-10">
          ${section.children
            .map(
              child => `<a href="${navHref(child)}" class="flex items-center rounded-xl px-3 py-2 text-sm transition ${
                child === activeChild
                  ? "bg-sky-500/20 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }">${child}</a>`
            )
            .join("")}
        </div>`
      : "";

    return `<div class="rounded-2xl ${active ? "bg-white/5" : ""}">
      <a href="${navHref(section.children[0])}" class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
        active ? "text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
      }">
        <span class="${active ? "text-sky-300" : "text-slate-400"}">${PARENT_ICON[section.parent]}</span>
        <span class="flex-1">${section.parent}</span>
        <span class="text-xs ${active ? "text-sky-300" : "text-slate-500"}">${active ? "▾" : "▸"}</span>
      </a>
      ${children}
    </div>`;
  }).join("");
}

function renderStats(stats = []) {
  if (!stats.length) return "";
  return `<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    ${stats
      .map(
        item => `<div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-500">${item.label}</p>
              <p class="mt-3 text-3xl font-semibold text-slate-900">${item.value}</p>
            </div>
            <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${toneClasses(item.tone)}">${item.meta || "概览"}</span>
          </div>
          <p class="mt-3 text-sm text-slate-500">${item.help || ""}</p>
        </div>`
      )
      .join("")}
  </section>`;
}

function renderPage(config) {
  const app = document.getElementById("app");
  if (!app) return;

  const badges = (config.badges || [])
    .map(
      badge => `<span class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">${badge}</span>`
    )
    .join("");

  app.innerHTML = `
    <div class="min-h-screen bg-slate-100 text-slate-800">
      <div class="flex min-h-screen">
        <aside class="hidden w-64 shrink-0 flex-col bg-[#1f2747] text-slate-100 lg:flex">
          <div class="border-b border-white/10 px-5 py-5">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-black text-white panel-glow">CY</div>
              <div>
                <p class="text-lg font-bold">淳渔 CMS</p>
                <p class="text-xs text-slate-400">Tailwind 静态页面稿</p>
              </div>
            </div>
          </div>
          <div class="mock-scrollbar flex-1 overflow-y-auto px-4 py-5">
            <a href="${navHref("首页")}" class="mb-3 flex items-center gap-3 rounded-2xl bg-sky-500/15 px-4 py-3 text-sm font-medium text-sky-200">
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/20 text-sky-300">⌂</span>
              <span>静态页面导航</span>
            </a>
            <div class="space-y-2">
              ${renderMenu(config.parent, config.child)}
            </div>
          </div>
        </aside>

        <div class="flex min-w-0 flex-1 flex-col">
          <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
            <div class="flex items-center gap-3">
              <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500">☰</div>
              <div>
                <p class="text-sm text-slate-500">${config.parent}</p>
                <h1 class="text-lg font-semibold text-slate-900">${config.title}</h1>
              </div>
            </div>
            <div class="hidden items-center gap-3 md:flex">
              <div class="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">搜索页面内容</div>
              <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500">⌕</div>
              <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500">⤢</div>
              <div class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500">T</div>
            </div>
          </header>

          <div class="border-b border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-500 sm:px-6">
            首页 / ${config.parent} / <span class="font-medium text-slate-700">${config.child}</span>
          </div>

          <main class="p-4 sm:p-6 lg:p-8">
            <div class="mx-auto max-w-[1440px] space-y-6">
              <section class="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
                <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <div class="max-w-3xl">
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">${config.parent}</p>
                    <h2 class="mt-3 text-3xl font-bold tracking-tight text-slate-900">${config.title}</h2>
                    <p class="mt-3 text-sm leading-7 text-slate-500">${config.description || ""}</p>
                  </div>
                  <div class="flex flex-wrap gap-2">${badges}</div>
                </div>
              </section>

              ${renderStats(config.stats)}

              ${config.content}
            </div>
          </main>

          <div class="fixed bottom-6 right-6 hidden flex-col gap-3 xl:flex">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-lg ring-1 ring-slate-200">✦</div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500 shadow-lg ring-1 ring-rose-200">A</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.renderPage = renderPage;
