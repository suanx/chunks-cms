<template>
  <el-table :data="data" v-loading="loading" border stripe @selection-change="$emit('selection-change', $event)">
    <slot />
    <template #empty><el-empty description="暂无数据" /></template>
  </el-table>
</template>

<script setup lang="ts">
defineProps<{ data: any[]; loading?: boolean }>();
defineEmits(['selection-change']);
</script>
