<template>
  <div class="container page">
    <h1 class="section-title">我的收藏</h1>
    <VideoList :videos="favorites" />
    <el-empty v-if="!favorites.length" description="暂无收藏" />
  </div>
</template>

<script setup lang="ts">
useHead({ title: '我的收藏' });
definePageMeta({ middleware: 'auth' });
const favorites = ref<any[]>([]);
</script>
