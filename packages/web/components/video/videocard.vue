<template>
  <NuxtLink :to="`/video/${video.id}`" class="video-card">
    <div class="cover">
      <img :src="video.coverUrl || '/default-cover.png'" :alt="video.title" />
      <span class="duration" v-if="video.duration">{{ formatDuration(video.duration) }}</span>
    </div>
    <div class="info">
      <h3 class="title text-clamp-2">{{ video.title }}</h3>
      <div class="meta">
        <span class="views">{{ formatNumber(video.viewCount) }} 次播放</span>
        <span class="time">{{ formatDate(video.createdAt) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ video: any }>();

const formatDuration = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}` : `${m}:${String(sec).padStart(2,'0')}`;
};

const formatNumber = (n: number) => {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
};

const formatDate = (d: string) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('zh-CN');
};
</script>

<style scoped lang="scss">
.video-card {
  display: block;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-4px); box-shadow: var(--shadow-base); }
}
.cover {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: #eee;
  img { width: 100%; height: 100%; object-fit: cover; }
}
.duration {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}
.info {
  padding: 10px 12px;
}
.title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-primary);
  margin-bottom: 6px;
  line-height: 1.4;
}
.meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-color-secondary);
}
</style>
