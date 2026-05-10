<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()

// 隐藏导航栏的详情页路径前缀（专家详情页需要显示导航栏）
const hideNavPrefixes = ['/', '/paper', '/activity', '/monograph', '/patent']

const shouldShowNav = computed(() => {
  // 检查当前路径是否以任何隐藏前缀开头
  for (const prefix of hideNavPrefixes) {
    if (route.path === prefix || route.path.startsWith(prefix + '/')) {
      return false
    }
  }
  return true
})
</script>

<template>
  <div class="app">
    <NavBar v-if="shouldShowNav" />
    <router-view />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  padding-top: 53px;
  background-color: #f8f6f0;
  box-sizing: border-box;
}
</style>
