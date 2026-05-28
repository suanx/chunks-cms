<template>
  <div class="container page">
    <h1 class="section-title">观看历史</h1>
    <VideoList :videos="history" />
    <el-empty v-if="!history.length" description="暂无观看记录" />
  </div>
</template>

<script setup lang="ts">
useHead({ title: '观看历史' });
definePageMeta({ middleware: 'auth' });
const history = ref<any[]>([]);
</script>
