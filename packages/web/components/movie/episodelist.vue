<template>
  <div class="episode-list">
    <h3>剧集列表</h3>
    <div class="episodes">
      <el-button v-for="ep in episodes" :key="ep.id" :type="activeId === ep.id ? 'primary' : 'default'"
        @click="$emit('select', ep)" size="small">
        {{ ep.title || `第${ep.episodeNumber}集` }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ episodes: any[]; activeId?: number }>();
defineEmits(['select']);
</script>

<style scoped lang="scss">
.episode-list h3 { margin-bottom: 12px; }
.episodes { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
