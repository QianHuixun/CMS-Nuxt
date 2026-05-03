import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import HomeView from '@/views/HomeView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import KnowledgeView from '@/views/KnowledgeView.vue'
import AcademicView from '@/views/AcademicView.vue'
import AchievementRegistryView from '@/views/AchievementRegistryView.vue'
import ActivitySilhouetteView from '@/views/ActivitySilhouetteView.vue'
import ActivityTimelineView from '@/views/ActivityTimelineView.vue'
import AcademicNews from '@/views/AcademicNews.vue'
import ExpertDetailView from '@/views/ExpertDetailView.vue'
import PaperDetailView from '@/views/PaperDetailView.vue'
import MonographDetailView from '@/views/MonographDetailView.vue'
import PatentDetailView from '@/views/PatentDetailView.vue'

const routes = [
  { path: '/', component: LandingView },
  { path: '/home', component: HomeView },
  { path: '/resources', component: ResourcesView },
  { path: '/knowledge', component: KnowledgeView },
  { path: '/academic', component: AcademicView },
  { path: '/academic-news', component: AcademicNews, name: 'AcademicNews' },
  { path: '/achievements', component: AchievementRegistryView, name: 'Achievements' },
  { path: '/activity/:id?', component: ActivitySilhouetteView, name: 'ActivitySilhouette' },
  { path: '/activity-timeline', component: ActivityTimelineView, name: 'ActivityTimeline' },
  { path: '/expert/:id?', component: ExpertDetailView, name: 'ExpertDetail' },
  { path: '/paper/:id?', component: PaperDetailView, name: 'PaperDetail' },
  { path: '/monograph/:id?', component: MonographDetailView, name: 'MonographDetail' },
  { path: '/patent/:id?', component: PatentDetailView, name: 'PatentDetail' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
