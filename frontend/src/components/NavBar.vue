<script setup lang="ts">
import { useRoute } from 'vue-router'

interface NavItem {
  name: string
  path: string
  activePaths?: string[]
}

const route = useRoute()

const navItems: NavItem[] = [
  { name: '首页', path: '/home' },
  { name: '资源导航', path: '/resources' },
  { name: '知识图谱', path: '/knowledge' },
  { name: '学术动态', path: '/academic', activePaths: ['/academic-news', '/achievements', '/activity-timeline'] },
]

const isActive = (item: NavItem): boolean => {
  if (route.path === item.path || route.path.startsWith(`${item.path}/`)) return true
  return item.activePaths?.some((path) => route.path === path || route.path.startsWith(`${path}/`)) ?? false
}
</script>

<template>
  <header class="header">
    <div class="title-wrapper">
      <img src="@/assets/icons/nav-logo.svg" alt="logo" class="nav-logo" />
      <h1 class="header-title">出土医学文献文物保护研究数字实验室数据集成平台</h1>
    </div>
    <nav class="nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="['nav-item', { active: isActive(item) }]"
      >
        {{ item.name }}
      </router-link>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 16px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--bg-page);
  z-index: 10;
  box-sizing: border-box;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-logo {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.header-title {
  font-family: var(--font-nav);
  font-size: var(--font-size-md);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-xs);
}

.nav {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-item {
  font-family: var(--font-nav);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  text-decoration: none;
  position: relative;
  transition: color 0.2s ease, transform 0.2s ease;
}

.nav-item:hover {
  color: var(--color-primary);
  transform: translateY(-1px);
}

.nav-item.active {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.nav-item.active::after,
.nav-item:hover::after {
  transform: scaleX(1);
  opacity: 1;
}

.nav-item::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--color-primary);
  opacity: 0;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.24s ease, opacity 0.24s ease;
}
</style>
