<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: '首页', path: '/home' },
  { name: '资源导航', path: '/resources' },
  { name: '知识图谱', path: '/knowledge' },
  { name: '学术动态', path: '/academic' },
]
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
        :class="['nav-item', { active: route.path === item.path }]"
      >
        {{ item.name }}
      </router-link>
    </nav>
  </header>
</template>

<style scoped>
.header {
  padding: 16px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--bg-page);
  position: relative;
  z-index: 10;
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
  font-size: 14px;
  color: var(--color-primary);
  font-weight: normal;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav-item {
  font-size: 14px;
  color: var(--color-text);
  text-decoration: none;
  position: relative;
  transition: color 0.2s ease;
}

.nav-item:hover {
  color: var(--color-primary);
}

.nav-item.active {
  color: var(--color-primary);
}

.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--color-primary);
}
</style>
