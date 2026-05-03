import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import HomeView from '@/views/HomeView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import KnowledgeView from '@/views/KnowledgeView.vue'
import AcademicView from '@/views/AcademicView.vue'
import AchievementRegistryView from '@/views/AchievementRegistryView.vue'
import ActivitySilhouette from '@/views/activity-silhouette.vue'
import ActivityTimelineView from '@/views/ActivityTimelineView.vue'
import ExpertDetailView from '@/views/ExpertDetailView.vue'
import PaperDetailView from '@/views/PaperDetailView.vue'

const routes = [
  { path: '/', component: LandingView },
  { path: '/home', component: HomeView },
  { path: '/resources', component: ResourcesView },
  { path: '/knowledge', component: KnowledgeView },
  { path: '/academic', component: AcademicView },
  { path: '/achievements', component: AchievementRegistryView, name: 'Achievements' },
  { path: '/activity/:id?', component: ActivitySilhouette, name: 'ActivitySilhouette' },
  { path: '/activity-timeline', component: ActivityTimelineView, name: 'ActivityTimeline' },
  { path: '/expert/:id?', component: ExpertDetailView, name: 'ExpertDetail' },
  { path: '/paper/:id?', component: PaperDetailView, name: 'PaperDetail' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
