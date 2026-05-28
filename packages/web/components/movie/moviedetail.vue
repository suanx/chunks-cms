<template>
  <div class="movie-detail">
    <div class="cover">
      <img :src="movie.backdropUrl || movie.coverUrl" :alt="movie.title" />
    </div>
    <div class="info">
      <h1>{{ movie.title }}</h1>
      <p v-if="movie.originalTitle" class="original-title">{{ movie.originalTitle }}</p>
      <div class="meta-list">
        <span v-if="movie.type">{{ typeLabels[movie.type] }}</span>
        <span v-if="movie.releaseYear">{{ movie.releaseYear }}</span>
        <span v-if="movie.region">{{ movie.region }}</span>
        <span v-if="movie.language">{{ movie.language }}</span>
        <span v-if="movie.rateAvg > 0">⭐ {{ movie.rateAvg.toFixed(1) }} ({{ movie.rateCount }}人评)</span>
      </div>
      <p v-if="movie.director" class="director">导演: {{ movie.director }}</p>
      <p v-if="movie.actorsDesc" class="actors">主演: {{ movie.actorsDesc }}</p>
      <p v-if="movie.description" class="desc">{{ movie.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ movie: any }>();
const typeLabels: Record<number, string> = { 1: '电影', 2: '电视剧', 3: '综艺', 4: '动漫', 5: '纪录片' };
</script>

<style scoped lang="scss">
.movie-detail {
  .cover {
    width: 100%;
    max-height: 400px;
    overflow: hidden;
    border-radius: 8px;
    img { width: 100%; object-fit: cover; }
  }
  .info { padding: 20px 0; }
  h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
  .original-title { color: var(--text-color-secondary); margin-bottom: 12px; }
  .meta-list { display: flex; gap: 12px; color: var(--text-color-secondary); font-size: 14px; margin-bottom: 12px; flex-wrap: wrap; }
  .director, .actors, .desc { margin-bottom: 8px; font-size: 14px; line-height: 1.8; color: var(--text-color-regular); }
}
</style>
