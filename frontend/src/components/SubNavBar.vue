<script setup>
import { useRoute } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: '出土医学文献文物保护研究数字实验室数据集成平台',
  },
  items: {
    type: Array,
    default: () => [
      { name: '文献档案', path: '/resources' },
      { name: '资源动态', path: '/academic' },
      { name: '专家智库', path: '/expert', activePrefix: '/expert' },
      { name: '数字化实验室', path: '/knowledge' },
    ],
  },
})

const route = useRoute()

const isActive = (item) => {
  if (item.exact) return route.path === item.path
  if (item.activePrefix) return route.path.startsWith(item.activePrefix)
  return route.path === item.path
}
</script>

<template>
  <header class="sub-header">
    <router-link class="sub-header-title" to="/home">
      {{ props.title }}
    </router-link>

    <nav class="sub-nav" aria-label="子导航">
      <router-link
        v-for="item in props.items"
        :key="item.path"
        :to="item.path"
        :class="['sub-nav-item', { active: isActive(item) }]"
      >
        {{ item.name }}
      </router-link>
    </nav>
  </header>
</template>

<style scoped>
.sub-header {
  padding: 16px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0d8c8;
  background-color: rgba(248, 246, 240, 0.88);
  position: relative;
  z-index: 10;
}

.sub-header-title {
  min-width: 0;
  color: var(--color-primary);
  font-size: 14px;
  font-weight: normal;
  font-family: "SimSun", "宋体", serif;
  line-height: 1.35;
  text-decoration: none;
  white-space: nowrap;
}

.sub-nav {
  display: flex;
  gap: 32px;
}

.sub-nav-item {
  color: #333;
  font-size: 14px;
  font-family: "SimSun", "宋体", serif;
  line-height: 1.4;
  text-decoration: none;
  position: relative;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.sub-nav-item:hover,
.sub-nav-item.active {
  color: var(--color-primary);
}

.sub-nav-item.active::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--color-primary);
}

@media (max-width: 900px) {
  .sub-header {
    padding: 14px 18px;
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }

  .sub-header-title {
    width: 100%;
    white-space: normal;
  }

  .sub-nav {
    width: 100%;
    gap: 18px;
    overflow-x: auto;
    padding-bottom: 2px;
  }
}
</style>
