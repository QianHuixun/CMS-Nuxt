<template>
  <el-container style="height: 100vh">
    <el-aside width="250px" style="background-color: #001529">
      <div class="logo">中医大</div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409EFF"
        :collapse="false"
      >
        <el-sub-menu
          v-for="parentMenu in menus"
          :key="parentMenu.id"
          :index="parentMenu.path"
        >
          <template #title>
            <el-icon><component :is="parentMenu.icon" /></el-icon>
            <span>{{ parentMenu.menu_name }}</span>
          </template>
          <el-menu-item
            v-for="childMenu in parentMenu.children"
            :key="childMenu.id"
            :index="`${parentMenu.path}/${childMenu.path}`"
            @click="navigateTo(`${parentMenu.path}/${childMenu.path}`)"
          >
            <el-icon><component :is="childMenu.icon" /></el-icon>
            <span>{{ childMenu.menu_name }}</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header
        style="
          background-color: #fff;
          border-bottom: 1px solid #e0e0e0;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div class="header-title">
          <template v-if="currentMenu">
            {{ currentMenu.parent_menu_name }} - {{ currentMenu.menu_name }}
          </template>
          <template v-else> 系统管理 </template>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar size="small">管</el-avatar>
              <span style="margin-left: 10px">管理员</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main style="padding: 20px; background-color: #f5f7fa">
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {
  ArrowDown,
  Setting,
  User,
  Document,
  Cpu,
  Star,
  Menu,
  Monitor,
  UserFilled,
  Timer,
  Reading,
  DataLine,
  PieChart,
  Edit,
  Top,
  Picture,
} from "@element-plus/icons-vue";

export default {
  name: "MainLayout",
  components: {
    Setting,
    User,
    Document,
    Cpu,
    Star,
    Menu,
    Monitor,
    UserFilled,
    Timer,
    Reading,
    DataLine,
    PieChart,
    Edit,
    Top,
    Picture,
    ArrowDown,
  },
  data() {
    return {
      activeMenu: "",
      currentMenu: null,
      menus: [
        {
          id: 1,
          menu_name: "系统基础配置管理",
          path: "system-base-config",
          icon: "Setting",
          children: [
            {
              id: 11,
              menu_name: "导航配置",
              path: "nav-config",
              icon: "Menu",
            },
            {
              id: 12,
              menu_name: "屏保配置",
              path: "screen-saver-config",
              icon: "Monitor",
            },
          ],
        },
        {
          id: 2,
          menu_name: "人才与对应科研管理",
          path: "talent-research",
          icon: "User",
          children: [
            {
              id: 21,
              menu_name: "专家库管理",
              path: "expert-library",
              icon: "UserFilled",
            },
            {
              id: 22,
              menu_name: "课题时空管理",
              path: "topic-space-time",
              icon: "Timer",
            },
          ],
        },
        {
          id: 3,
          menu_name: "论文著作与成果管理",
          path: "paper-achievement",
          icon: "Document",
          children: [
            {
              id: 31,
              menu_name: "书籍导入",
              path: "book-import",
              icon: "Reading",
            },
            {
              id: 32,
              menu_name: "仿真录入",
              path: "simulation-entry",
              icon: "DataLine",
            },
          ],
        },
        {
          id: 4,
          menu_name: "自动化辅助",
          path: "automation-tools",
          icon: "Cpu",
          children: [
            {
              id: 41,
              menu_name: "词云",
              path: "word-cloud",
              icon: "Picture",
            },
            {
              id: 42,
              menu_name: "图表生成",
              path: "chart-generator",
              icon: "PieChart",
            },
          ],
        },
        {
          id: 5,
          menu_name: "活动管理",
          path: "activity-management",
          icon: "Star",
          children: [
            {
              id: 51,
              menu_name: "沉浸式编辑",
              path: "immersive-editor",
              icon: "Edit",
            },
            {
              id: 52,
              menu_name: "头条精选",
              path: "headline-featured",
              icon: "Top",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.updateActiveMenu();
    this.updateCurrentMenu();
  },
  watch: {
    $route: {
      handler() {
        this.updateActiveMenu();
        this.updateCurrentMenu();
      },
      immediate: true,
    },
  },
  methods: {
    navigateTo(path) {
      this.$router.push(`/${path}`);
    },
    updateActiveMenu() {
      const path = this.$route.path;
      if (path) {
        this.activeMenu = path.substring(1);
      }
    },
    updateCurrentMenu() {
      const path = this.$route.path;
      if (path) {
        const parts = path.split("/").filter(Boolean);
        if (parts.length === 2) {
          const parentPath = parts[0];
          const childPath = parts[1];
          const parentMenu = this.menus.find(
            (menu) => menu.path === parentPath,
          );
          if (parentMenu) {
            const childMenu = parentMenu.children.find(
              (child) => child.path === childPath,
            );
            if (childMenu) {
              this.currentMenu = {
                parent_menu_name: parentMenu.menu_name,
                menu_name: childMenu.menu_name,
              };
            }
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
  background-color: #001529;
  border-bottom: 1px solid #1f2d3d;
}

.el-menu-vertical-demo {
  border-right: none;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.el-main {
  padding: 20px;
}
</style>
