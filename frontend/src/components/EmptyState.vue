<template>
  <div class="empty-state">
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  padding: 80px 20px;
  text-align: center;
  color: var(--color-secondary);
  font-family: var(--font-sans);
  font-size: var(--font-size-md);
  line-height: var(--line-height-reading);
}
</style>
