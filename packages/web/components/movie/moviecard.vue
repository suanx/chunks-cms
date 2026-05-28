<template>
  <NuxtLink :to="`/movie/${movie.id}`" class="movie-card">
    <div class="cover">
      <img :src="movie.coverUrl || '/default-cover.png'" :alt="movie.title" />
      <span class="type-badge">{{ typeLabels[movie.type] || '影视' }}</span>
    </div>
    <div class="info">
      <h3 class="title text-ellipsis">{{ movie.title }}</h3>
      <div class="meta">
        <span v-if="movie.releaseYear">{{ movie.releaseYear }}</span>
        <span v-if="movie.rateAvg > 0" class="rating">⭐ {{ movie.rateAvg.toFixed(1) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ movie: any }>();

const typeLabels: Record<number, string> = { 1: '电影', 2: '电视剧', 3: '综艺', 4: '动漫', 5: '纪录片' };
</script>

<style scoped lang="scss">
.movie-card {
  display: block;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-4px); box-shadow: var(--shadow-base); }
}
.cover {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: #eee;
  img { width: 100%; height: 100%; object-fit: cover; }
}
.type-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--primary-color);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
}
.info { padding: 8px 10px; }
.title { font-size: 14px; font-weight: 500; color: var(--text-color-primary); margin-bottom: 4px; }
.meta { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-color-secondary); }
.rating { color: #e6a23c; }
</style>
