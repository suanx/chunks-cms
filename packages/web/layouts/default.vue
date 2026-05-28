<template>
  <div class="layout-default">
    <AppHeader />
    <main class="layout-main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.layout-default {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.layout-main {
  flex: 1;
  padding-top: var(--header-height);
}
</style>
