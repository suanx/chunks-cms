<template>
  <div class="rating-stars">
    <span class="score">{{ value.toFixed(1) }}</span>
    <el-rate :model-value="value / 2" disabled :max="5" />
    <span v-if="count" class="count">({{ count }}人评)</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ value: number; count?: number }>(), { value: 0, count: 0 });
</script>

<style scoped lang="scss">
.rating-stars { display: flex; align-items: center; gap: 6px; }
.score { font-size: 20px; font-weight: 700; color: #e6a23c; }
.count { font-size: 12px; color: var(--text-color-secondary); }
</style>
