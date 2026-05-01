import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import HomeView from '@/views/HomeView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import KnowledgeView from '@/views/KnowledgeView.vue'
import AcademicNews from '@/views/AcademicNews.vue'
import ActivitySilhouette from '@/views/activity-silhouette.vue'
import ExpertDetailView from '@/views/ExpertDetailView.vue'
import PaperDetailView from '@/views/PaperDetailView.vue'

const routes = [
  { path: '/', component: LandingView },
  { path: '/home', component: HomeView },
  { path: '/resources', component: ResourcesView },
  { path: '/knowledge', component: KnowledgeView },
  { path: '/academic', component: AcademicNews },
  { path: '/activity/:id?', component: ActivitySilhouette, name: 'ActivitySilhouette' },
  { path: '/expert/:id?', component: ExpertDetailView, name: 'ExpertDetail' },
  { path: '/paper/:id?', component: PaperDetailView, name: 'PaperDetail' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
