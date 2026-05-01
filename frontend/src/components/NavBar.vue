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
    <h1 class="header-title">出土医学文献文物保护研究数字实验室数据集成平台</h1>
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
  border-bottom: 1px solid #e0d8c8;
  background-color: #f8f6f0;
  position: relative;
  z-index: 10;
}

.header-title {
  font-size: 14px;
  color: var(--color-primary);
  font-weight: normal;
  font-family: "SimSun", "宋体", serif;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav-item {
  font-size: 14px;
  color: #333;
  text-decoration: none;
  position: relative;
  font-family: "SimSun", "宋体", serif;
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
