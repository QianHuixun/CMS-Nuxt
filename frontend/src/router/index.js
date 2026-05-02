import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import HomeView from '@/views/HomeView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import KnowledgeView from '@/views/KnowledgeView.vue'
import AcademicView from '@/views/AcademicView.vue'

const routes = [
  { path: '/', component: LandingView },
  { path: '/home', component: HomeView },
  { path: '/resources', component: ResourcesView },
  { path: '/knowledge', component: KnowledgeView },
  { path: '/academic', component: AcademicView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
