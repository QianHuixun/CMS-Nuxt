<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const videoRef = ref(null)
const isPlaying = ref(false)
const isLeaving = ref(false)
const videoSrc = '/mock-assets/videos/landing-intro.mp4'
const pageConfig = {
  title: '出土医学文献文物保护研究数字重点实验室',
  subtitle: '数据集成平台',
  actionText: '进入系统 →'
}

const goHome = () => {
  router.replace('/home').catch(() => {})
}

const finishIntro = () => {
  if (isLeaving.value) return
  isLeaving.value = true
  window.setTimeout(goHome, 360)
}

async function enterSystem() {
  if (isPlaying.value || isLeaving.value) return

  isPlaying.value = true
  await nextTick()

  const video = videoRef.value
  if (!video) {
    finishIntro()
    return
  }

  try {
    video.currentTime = 0
    await video.play()
  } catch (e) {
    console.warn('开屏视频播放失败，直接进入首页', e)
    finishIntro()
  }
}
</script>

<template>
  <div :class="['landing-page', { 'landing-page--playing': isPlaying, 'landing-page--leaving': isLeaving }]">
    <video
      ref="videoRef"
      class="landing-video"
      :src="videoSrc"
      preload="auto"
      playsinline
      muted
      @ended="finishIntro"
    ></video>

    <div class="landing-overlay" aria-hidden="true"></div>

    <div class="landing-content">
      <div class="title-wrapper">
        <div class="title-main">{{ pageConfig.title }}</div>
        <div class="line line-left"></div>
        <div class="line line-right"></div>
      </div>

      <div class="title-sub">{{ pageConfig.subtitle }}</div>

      <button class="btn-primary" type="button" @click="enterSystem">
        {{ pageConfig.actionText }}
      </button>
    </div>

    <div class="landing-transition" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
.landing-page {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background-color: #f8f6f0;
  isolation: isolate;
}

.landing-video {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  min-width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  display: block;
  object-fit: cover;
  object-position: center center;
  background-color: #fff;
  z-index: 0;
  transition: opacity 0.34s ease, transform 0.34s ease;
}

.landing-overlay {
  position: fixed;
  inset: 0;
  background: rgba(28, 20, 18, 0.12);
  z-index: 1;
  transition: opacity 0.34s ease;
}

.landing-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 120px;
  transition: opacity 0.42s ease, transform 0.42s ease, visibility 0s linear 0s;
}

.landing-page--playing .landing-content {
  opacity: 0;
  transform: translateY(-16px);
  visibility: hidden;
  transition: opacity 0.42s ease, transform 0.42s ease, visibility 0s linear 0.42s;
}

.landing-page--playing .landing-overlay {
  opacity: 0;
}

.landing-transition {
  position: fixed;
  inset: 0;
  background: #f8f6f0;
  opacity: 0;
  pointer-events: none;
  z-index: 3;
  transition: opacity 0.34s ease;
}

.landing-page--leaving .landing-video {
  opacity: 0;
  transform: scale(1.015);
}

.landing-page--leaving .landing-transition {
  opacity: 0.92;
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
