<script setup>
defineProps({
  readerLabel: {
    type: String,
    default: 'Document reader',
  },
  asideLabel: {
    type: String,
    default: 'Document detail',
  },
})
</script>

<template>
  <main class="document-reader-layout">
    <section class="document-reader-workspace" :aria-label="readerLabel">
      <slot name="reader"></slot>
    </section>

    <aside class="document-reader-aside" :aria-label="asideLabel">
      <slot name="aside"></slot>
    </aside>
  </main>
</template>

<style scoped>
.document-reader-layout {
  height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  background: url('@/assets/images/backgrounds/mult-page/page-bg.png') center center / cover fixed;
  color: #2b2520;
  overflow: hidden;
  font-family: var(--font-sans);
}

.document-reader-workspace {
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background-color: #f5f2ed;
  overflow: hidden;
}

.document-reader-aside::-webkit-scrollbar {
  display: none;
}

.document-reader-aside {
  min-height: 0;
  padding: 0 32px 32px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 16px 48px rgba(43, 37, 32, 0.12);
  overflow-y: auto;
  scrollbar-width: none;
  z-index: 3;
}

@media (max-width: 1180px) {
  .document-reader-layout {
    min-height: 100vh;
    height: auto;
    display: flex;
    flex-direction: column;
    overflow: visible;
  }

  .document-reader-workspace {
    min-height: 720px;
    overflow: visible;
  }

  .document-reader-aside {
    min-height: auto;
    padding: 0 32px 40px;
    overflow: visible;
  }
}

@media (max-width: 680px) {
  .document-reader-aside {
    padding-right: 20px;
    padding-left: 20px;
  }
}
</style>
