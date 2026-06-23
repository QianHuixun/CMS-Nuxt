import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }) => {
  const enableProdMock = process.env.ENABLE_PROD_MOCK === 'true'

  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: command === 'serve',
        prodEnabled: enableProdMock,
        injectCode: `
          import { setupProdMockServer } from '../mock/index.js'
          setupProdMockServer()
        `,
        logger: true,
      }),
    ],
    server: {
      allowedHosts: ['zkg964gqfbxx8r.honos.dev', 'tcmu.hub.feashow.cn'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
