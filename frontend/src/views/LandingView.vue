<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const pageConfig = {
  title: '出土医学文献文物保护研究数字重点实验室',
  subtitle: '数据集成平台',
  actionText: '进入系统 →'
}

function enterSystem() {
  router.push('/home')
}
</script>

<template>
  <div class="home">
    <div class="title-wrapper">
      <div class="title-main">{{ pageConfig.title }}</div>
      <div class="line line-left"></div>
      <div class="line line-right"></div>
    </div>

    <div class="title-sub">{{ pageConfig.subtitle }}</div>

    <button class="btn-primary" @click="enterSystem">{{ pageConfig.actionText }}</button>
  </div>
</template>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 120px;
  background: url('@/assets/images/backgrounds/landing/home-bg.png') no-repeat center center;
  background-size: cover;
}

.title-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.title-main {
  font-family: var(--font-landing-title);
  font-weight: var(--font-weight-regular);
  font-style: var(--font-style-normal);
  font-size: var(--font-size-landing-title);
  line-height: var(--line-height-control);
  letter-spacing: var(--letter-spacing-tight);
  text-align: center;
  white-space: nowrap;
  color: #fff;
}

.line {
  position: absolute;
  bottom: -6px;
  width: clamp(40px, 8vw, 100px);
  height: 2px;
  background-color: #fff;
  opacity: 0.8;
}

.line-left {
  right: calc(100% + 36px);
  left: auto;
}

.line-right {
  left: calc(100% + 36px);
  right: auto;
}

.title-sub {
  font-family: var(--font-landing-subtitle);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-landing-subtitle);
  letter-spacing: var(--letter-spacing-sm);
  text-align: center;
  opacity: 0.9;
  margin-bottom: 100px;
  color: #fff;
}

.btn-primary {
  padding: 16px 48px;
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  font-size: var(--font-size-4xl);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
}
</style>
