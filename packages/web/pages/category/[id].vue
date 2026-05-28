<template>
  <div class="container page">
    <h1 class="section-title">分类: {{ category?.name || '加载中...' }}</h1>
    <VideoList :videos="videos" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const category = ref<any>(null);
const videos = ref<any[]>([]);

onMounted(async () => {
  const { api } = useApi();
  const data = await api.get('/videos', { categoryId: route.params.id });
  videos.value = data?.list || [];
});
</script>
