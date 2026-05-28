<template>
  <el-carousel height="360px" v-if="banners.length" :autoplay="true" :interval="5000">
    <el-carousel-item v-for="item in banners" :key="item.id">
      <a :href="item.linkUrl || '#'" class="banner-link">
        <img :src="item.imageUrl" :alt="item.title" class="banner-img" />
      </a>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts">
defineProps<{ banners: any[] }>();
</script>

<style scoped lang="scss">
.banner-link { display: block; width: 100%; height: 100%; }
.banner-img { width: 100%; height: 100%; object-fit: cover; }
</style>
