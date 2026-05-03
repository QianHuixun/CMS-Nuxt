<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)

const navItems = [
  { name: '首页', path: '/home', exact: true },
  { name: '资源库', path: '/resources', activePrefix: '/resources' },
  { name: '知识图谱', path: '/knowledge', activePrefix: '/knowledge' },
  {
    name: '学术动态',
    path: '/academic',
    activePrefixes: ['/academic', '/achievements', '/activity', '/expert', '/paper'],
  },
]

const menuItems = [
  { name: '成果库', path: '/achievements', activePrefix: '/achievements' },
  { name: '活动剪影', path: '/activity', exact: true, activePrefix: '/activity/' },
  { name: '活动足迹', path: '/activity-timeline', activePrefix: '/activity-timeline' },
  { name: '专家详情', path: '/expert/chen-wei', activePrefix: '/expert' },
]

const isActive = (item) => {
  if (item.exact && route.path === item.path) return true
  if (item.activePrefixes) {
    return item.activePrefixes.some((prefix) => route.path.startsWith(prefix))
  }
  if (item.activePrefix) return route.path.startsWith(item.activePrefix)
  return route.path === item.path
}
</script>

<template>
  <header class="header">
    <router-link class="header-title" to="/home">
      出土医学文献文物保护研究数字实验室数据集成平台
    </router-link>

    <nav class="nav" aria-label="主导航">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="['nav-item', { active: isActive(item) }]"
      >
        {{ item.name }}
      </router-link>
      <div class="menu-wrap">
        <button
          class="menu-button"
          type="button"
          aria-label="打开菜单"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div v-if="isMenuOpen" class="menu-dropdown" role="menu">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            :class="['menu-link', { active: isActive(item) }]"
            role="menuitem"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  min-height: 64px;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  border-bottom: 1px solid rgba(132, 33, 48, 0.08);
  background-color: rgba(255, 253, 250, 0.92);
  box-shadow: 0 1px 5px rgba(55, 43, 36, 0.12);
  position: relative;
  z-index: 10;
}

.header-title {
  min-width: 0;
  color: var(--color-primary);
  font-family: "Noto Serif SC", "SimSun", "宋体", serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.04em;
  text-decoration: none;
}

.nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-item {
  flex: 0 0 auto;
  color: #57534e;
  font-family: "Noto Serif SC", "SimSun", "宋体", serif;
  font-size: 16px;
  line-height: 1.4;
  text-decoration: none;
  position: relative;
  transition: color 0.2s ease;
}

.nav-item:hover,
.nav-item.active {
  color: var(--color-primary);
}

.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: -9px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary);
}

.menu-button {
  width: 18px;
  height: 18px;
  padding: 0;
  display: grid;
  align-content: center;
  gap: 3px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.menu-button span {
  height: 2px;
  background-color: var(--color-primary);
}

.menu-button:hover span {
  background-color: var(--color-primary-hover);
}

.menu-wrap {
  position: relative;
  flex: 0 0 auto;
}

.menu-dropdown {
  position: absolute;
  top: calc(100% + 14px);
  right: 0;
  width: 168px;
  padding: 8px 0;
  border: 1px solid rgba(132, 33, 48, 0.1);
  background-color: rgba(255, 253, 250, 0.98);
  box-shadow: 0 12px 28px rgba(55, 43, 36, 0.16);
  z-index: 20;
}

.menu-dropdown::before {
  content: "";
  position: absolute;
  top: -8px;
  right: 8px;
  width: 14px;
  height: 14px;
  border-top: 1px solid rgba(132, 33, 48, 0.1);
  border-left: 1px solid rgba(132, 33, 48, 0.1);
  background-color: rgba(255, 253, 250, 0.98);
  transform: rotate(45deg);
}

.menu-link {
  position: relative;
  display: block;
  padding: 10px 18px;
  color: #57534e;
  font-family: "Noto Serif SC", "SimSun", "宋体", serif;
  font-size: 14px;
  line-height: 1.35;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.menu-link:hover,
.menu-link.active {
  color: var(--color-primary);
  background-color: rgba(132, 33, 48, 0.06);
}

.menu-link.active::before {
  content: "";
  position: absolute;
  top: 11px;
  bottom: 11px;
  left: 8px;
  width: 2px;
  background-color: var(--color-primary);
}

@media (max-width: 900px) {
  .header {
    padding: 16px 20px;
    align-items: flex-start;
    flex-direction: column;
  }

  .header-title {
    width: 100%;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: 0;
  }

  .nav {
    width: 100%;
    gap: 18px;
    flex-wrap: wrap;
    overflow: visible;
    padding-bottom: 4px;
  }

  .nav-item {
    font-size: 14px;
  }

  .menu-dropdown {
    right: auto;
    left: 0;
  }

  .menu-dropdown::before {
    right: auto;
    left: 4px;
  }
}
</style>
