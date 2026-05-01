<script setup>
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
</script>

<template>
  <div class="app">
    <NavBar v-if="route.path !== '/'" />
    <router-view />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #f8f6f0;
}
</style>
