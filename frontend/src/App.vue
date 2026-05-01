<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()

const hideNavPaths = ['/', '/knowledge']

const shouldShowNav = computed(() => {
  if (hideNavPaths.includes(route.path)) return false
  if (route.path.startsWith('/expert')) return false
  if (route.path.startsWith('/paper')) return false
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
  background-color: #f8f6f0;
}
</style>
