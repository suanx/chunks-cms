<template>
  <el-breadcrumb separator="/" class="admin-breadcrumb">
    <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
      {{ item.meta?.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
const route = useRoute();
const breadcrumbs = computed(() => route.matched.filter(r => r.meta?.title));
</script>

<style scoped>
.admin-breadcrumb { margin-bottom: 16px; }
</style>
