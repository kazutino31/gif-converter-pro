<template>
  <div class="main-layout-container">
    <header class="main-layout-header" v-if="$slots.header">
      <slot name="header"></slot>
    </header>

    <main class="main-layout-panel">
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
/* Standard Layout Container */
.main-layout-container {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* Header Area */
.main-layout-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  width: 100%;
}

.main-layout-panel {
  background: var(--panel-bg, #ffffff);
  border-radius: var(--radius-lg, 24px);
  padding: 40px;
  box-shadow: 
    0 4px 6px -1px rgba(72, 87, 103, 0.05),
    0 10px 15px -3px rgba(72, 87, 103, 0.05);
  border: 1px solid white;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  max-width: 100%;
}

@media (max-width: 640px) {
  .main-layout-container {
    padding: 0 10px;
  }
}

@media (max-width: 500px) {
  .main-layout-panel {
    /* padding: 30px 20px; */
    max-width: 100vw;
    display: block;
    align-items: center;
    margin: 0 auto;
  }
}
</style>
