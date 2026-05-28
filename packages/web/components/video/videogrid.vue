<template>
  <div class="video-grid">
    <VideoCard v-for="item in videos" :key="item.id" :video="item" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ videos: any[] }>();
</script>

<style scoped lang="scss">
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
</style>
