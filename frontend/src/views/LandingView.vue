<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function enterSystem() {
  router.push('/home')
}
</script>

<template>
  <div class="home">
    <div class="title-wrapper">
      <div class="title-main">出土医学文献文物保护研究数字重点实验室</div>
      <div class="line line-left"></div>
      <div class="line line-right"></div>
    </div>

    <div class="title-sub">數據集成平臺</div>

    <button class="btn-primary" @click="enterSystem">进入系统 →</button>
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
  background: url('/home-bg.png') no-repeat center center;
  background-size: cover;
}

.title-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.title-main {
  font-family: "FZYanZhenQingKaiShuJF", "KaiTi", "STKaiti", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: clamp(24px, 4.5vw, 56px);
  line-height: 1.4;
  letter-spacing: -0.05em;
  text-align: center;
  white-space: nowrap;
  color: #fff;
}

.line {
  position: absolute;
  bottom: 4px;
  width: clamp(60px, 12vw, 160px);
  height: 2px;
  background-color: #fff;
  opacity: 0.8;
}

.line-left {
  right: calc(100% + 16px);
  left: auto;
}

.line-right {
  left: calc(100% + 16px);
  right: auto;
}

.title-sub {
  font-family: "TengXiangFanXiaoGeJianDu", "KaiTi", "STKaiti", sans-serif;
  font-weight: 400;
  font-size: clamp(20px, 2.5vw, 32px);
  letter-spacing: 2px;
  text-align: center;
  opacity: 0.9;
  margin-bottom: 100px;
  color: #fff;
}
</style>
