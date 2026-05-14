<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()

const hideNavPrefixes = ['/', '/paper', '/activity', '/monograph', '/patent']

const shouldShowNav = computed(() => {
  for (const prefix of hideNavPrefixes) {
    if (route.path === prefix || route.path.startsWith(prefix + '/')) {
      return false
    }
  }
  return true
})

const isSubPage = computed(() => {
  return route.path !== '/' && route.path !== '/home'
})
</script>

<template>
  <div :class="['app', { 'app--with-nav': shouldShowNav, 'app--sub-page': isSubPage }]">
    <NavBar v-if="shouldShowNav" />
    <router-view v-slot="{ Component }">
      <transition name="route-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #f8f6f0;
  box-sizing: border-box;
}

.app--with-nav {
  padding-top: 53px;
}

.app--sub-page {
  background: #f8f6f0 url('@/assets/images/backgrounds/mult-page/page-bg.png') center center / cover fixed;
}
</style>
