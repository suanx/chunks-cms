<template>
  <el-card class="stats-card" shadow="hover">
    <div class="stats-icon" :style="{ background: color }">
      <el-icon :size="24" color="#fff"><component :is="icon" /></el-icon>
    </div>
    <div class="stats-info">
      <div class="stats-value">{{ value }}</div>
      <div class="stats-label">{{ label }}</div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}>(), { icon: 'DataLine', color: '#409eff' });
</script>

<style scoped lang="scss">
.stats-card {
  :deep(.el-card__body) { display: flex; align-items: center; gap: 16px; padding: 20px; }
}
.stats-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.stats-value { font-size: 28px; font-weight: 700; color: var(--el-text-color-primary); }
.stats-label { font-size: 14px; color: var(--el-text-color-secondary); margin-top: 4px; }
</style>
