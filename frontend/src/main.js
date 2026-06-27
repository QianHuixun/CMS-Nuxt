import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/global.css'
import App from './App.vue'
import router from './router'

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
    const { setupProdMockServer } = await import('./mock-client.js')
    setupProdMockServer()
  }

  const app = createApp(App)
  app.use(ElementPlus)
  app.use(router)
  app.mount('#app')
}

bootstrap()
