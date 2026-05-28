<template>
  <div class="container page">
    <h1 class="section-title">搜索: {{ route.query.keyword }}</h1>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="视频" name="video">
        <VideoList :videos="results" />
      </el-tab-pane>
      <el-tab-pane label="影视剧" name="movie">
        <div class="movie-grid">
          <MovieCard v-for="item in movieResults" :key="item.id" :movie="item" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const activeTab = ref('video');
const results = ref<any[]>([]);
const movieResults = ref<any[]>([]);

onMounted(async () => {
  const keyword = route.query.keyword as string;
  if (!keyword) return;
  const { api } = useApi();
  const data = await api.get('/search', { keyword });
  results.value = data?.videos || [];
  movieResults.value = data?.movies || [];
});
</script>

<style scoped lang="scss">
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}
</style>
