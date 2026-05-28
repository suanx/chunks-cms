<template>
  <div class="home-page">
    <section class="banner-section container">
      <BannerCarousel :banners="banners" />
    </section>
    <section class="section container">
      <h2 class="section-title">推荐视频</h2>
      <VideoList :videos="videos" />
    </section>
    <section class="section container">
      <h2 class="section-title">热门影视剧</h2>
      <div class="movie-grid">
        <MovieCard v-for="item in movies" :key="item.id" :movie="item" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '首页' });

const banners = ref<any[]>([]);
const videos = ref<any[]>([]);
const movies = ref<any[]>([]);

const { getVideos, getMovies, getBanners } = useVideo();

onMounted(async () => {
  try {
    const [v, m, b] = await Promise.all([
      getVideos({ page: 1, pageSize: 12, sortBy: 'created_at', sortOrder: 'DESC' }),
      getMovies({ page: 1, pageSize: 8, sortBy: 'view_count', sortOrder: 'DESC' }),
      getBanners(),
    ]);
    videos.value = v?.list || [];
    movies.value = m?.list || [];
    banners.value = b || [];
  } catch (e) { console.error(e); }
});
</script>

<style scoped lang="scss">
.section { margin-top: 40px; }
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}
</style>
