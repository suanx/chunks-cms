<template>
  <el-pagination v-if="total > 0" :current-page="page" :page-size="pageSize" :total="total"
    :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" background
    @update:current-page="$emit('update:page', $event)" @update:page-size="$emit('update:pageSize', $event)" />
</template>

<script setup lang="ts">
defineProps<{ page: number; pageSize: number; total: number }>();
defineEmits(['update:page', 'update:pageSize']);
</script>
