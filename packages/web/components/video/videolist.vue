<template>
  <div class="video-list">
    <VideoCard v-for="item in videos" :key="item.id" :video="item" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ videos: any[] }>();
</script>

<style scoped lang="scss">
.video-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
</style>
