import {
  createWebHistory,
  createRouter,
  createWebHashHistory,
} from "vue-router";
import { Star, Top, Edit } from "@element-plus/icons-vue"; //新增： 导入图标
/* Layout */
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: "/activity-management",
    component: Layout,
    meta: { title: "活动管理", icon: "Star" },
    children: [
      {
        path: "headline-featured",
        component: () =>
          import("@/views/activityManagement/headlineFeatured/index.vue"),
        name: "HeadlineFeatured",
        meta: { title: "头条精选", icon: "Top" },
      },
      {
        path: "immersive-editor",
        component: () =>
          import("@/views/activityManagement/immersiveEditor/index.vue"),
        name: "ImmersiveEditor",
        meta: { title: "沉浸式编辑", icon: "Edit" },
      },
    ],
  },
  {
    path: "/automation-tools",
    component: Layout,
    meta: { title: "自动化辅助", icon: "Cpu" },
    children: [
      {
        path: "chart-generator",
        component: () =>
          import("@/views/automationTools/chartGenerator/index.vue"),
        name: "ChartGenerator",
        meta: { title: "图表生成", icon: "PieChart" },
      },
      {
        path: "word-cloud",
        component: () => import("@/views/automationTools/wordCloud/index.vue"),
        name: "WordCloud",
        meta: { title: "词云", icon: "Picture" },
      },
    ],
  },
  {
    path: "/paper-achievement",
    component: Layout,
    meta: { title: "论文著作与成果管理", icon: "Document" },
    children: [
      {
        path: "book-import",
        component: () =>
          import("@/views/paperAchievement/bookImport/index.vue"),
        name: "BookImport",
        meta: { title: "书籍导入", icon: "Reading" },
      },
      {
        path: "simulation-entry",
        component: () =>
          import("@/views/paperAchievement/simulationEntry/index.vue"),
        name: "SimulationEntry",
        meta: { title: "仿真录入", icon: "Dataline" },
      },
    ],
  },
  {
    path: "/system-base-config",
    component: Layout,
    meta: { title: "系统基础配置管理", icon: "Setting" },
    children: [
      {
        path: "nav-config",
        component: () => import("@/views/systemBaseConfig/navConfig/index.vue"),
        name: "NavConfig",
        meta: { title: "导航配置", icon: "Menu" },
      },
      {
        path: "screen-saver-config",
        component: () =>
          import("@/views/systemBaseConfig/screenSaverConfig/index.vue"),
        name: "ScreenSaverConfig",
        meta: { title: "屏保配置", icon: "Monitor" },
      },
    ],
  },
  {
    path: "/talent-research",
    component: Layout,
    meta: { title: "人才与对应科研管理", icon: "User" },
    children: [
      {
        path: "expert-library",
        component: () =>
          import("@/views/talentResearch/expertLibrary/index.vue"),
        name: "ExpertLibrary",
        meta: { title: "专家库管理", icon: "Userfilled" },
      },
      {
        path: "topic-space-time",
        component: () =>
          import("@/views/talentResearch/topicSpaceTime/index.vue"),
        name: "TopicSpaceTime",
        meta: { title: "课题时空管理", icon: "Timer" },
      },
    ],
  }, //添加的后台路由配置
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true,
  },
  {
    path: "/register",
    component: () => import("@/views/register"),
    hidden: true,
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/error/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error/401"),
    hidden: true,
  },
  {
    path: "",
    component: Layout,
    redirect: "/index",
    children: [
      {
        path: "/index",
        component: () => import("@/views/index"),
        name: "Index",
        meta: { title: "首页", icon: "dashboard", affix: true },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "profile",
        component: () => import("@/views/system/user/profile/index"),
        name: "Profile",
        meta: { title: "个人中心", icon: "user" },
      },
    ],
  },
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: "/system/user-auth",
    component: Layout,
    hidden: true,
    permissions: ["system:user:edit"],
    children: [
      {
        path: "role/:userId(\\d+)",
        component: () => import("@/views/system/user/authRole"),
        name: "AuthRole",
        meta: { title: "分配角色", activeMenu: "/system/user" },
      },
    ],
  },
  {
    path: "/system/role-auth",
    component: Layout,
    hidden: true,
    permissions: ["system:role:edit"],
    children: [
      {
        path: "user/:roleId(\\d+)",
        component: () => import("@/views/system/role/authUser"),
        name: "AuthUser",
        meta: { title: "分配用户", activeMenu: "/system/role" },
      },
    ],
  },
  {
    path: "/system/dict-data",
    component: Layout,
    hidden: true,
    permissions: ["system:dict:list"],
    children: [
      {
        path: "index/:dictId(\\d+)",
        component: () => import("@/views/system/dict/data"),
        name: "Data",
        meta: { title: "字典数据", activeMenu: "/system/dict" },
      },
    ],
  },
  {
    path: "/monitor/job-log",
    component: Layout,
    hidden: true,
    permissions: ["monitor:job:list"],
    children: [
      {
        path: "index/:jobId(\\d+)",
        component: () => import("@/views/monitor/job/log"),
        name: "JobLog",
        meta: { title: "调度日志", activeMenu: "/monitor/job" },
      },
    ],
  },
  {
    path: "/tool/gen-edit",
    component: Layout,
    hidden: true,
    permissions: ["tool:gen:edit"],
    children: [
      {
        path: "index/:tableId(\\d+)",
        component: () => import("@/views/tool/gen/editTable"),
        name: "GenEdit",
        meta: { title: "修改生成配置", activeMenu: "/tool/gen" },
      },
    ],
  },
  {
    path: "/movie",
    component: Layout,
    hidden: true,
    permissions: ["movie:add"],
    children: [
      {
        path: "add",
        component: () => import("@/views/movie/list/add"),
        name: "Movieadd",
        meta: {
          title: "新增影视",
          noCache: false,
          activeMenu: "/movie/movieList",
        },
      },
      {
        path: "resources",
        component: () => import("@/views/movie/list/resources"),
        name: "Movieresources",
        meta: {
          title: "资源管理",
          noCache: false,
          activeMenu: "/movie/movieList",
        },
      },
    ],
  },
];

const router = createRouter({
  history:
    import.meta.env.VITE_APP_BUILD_MODE === "hash"
      ? createWebHashHistory()
      : createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
