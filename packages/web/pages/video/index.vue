<template>
  <div class="container page">
    <h1 class="section-title">视频列表</h1>
    <VideoList :videos="videos" />
    <el-empty v-if="!loading && !videos.length" description="暂无视频" />
    <div v-if="loading" class="loading-more">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>
    <div ref="loadMoreRef" class="load-more-trigger"></div>
    <Pagination v-model:page="page" v-model:pageSize="pageSize" :total="total" @update:page="fetchData" @update:pageSize="fetchData" />
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue';

useHead({ title: '视频' });
const { page, pageSize, total, setTotal } = usePagination();
const videos = ref<any[]>([]);
const loading = ref(false);
const loadMoreRef = ref<HTMLElement>();
const { getVideos } = useVideo();

const fetchData = async () => {
  loading.value = true;
  try {
    const data = await getVideos({ page: page.value, pageSize: pageSize.value });
    videos.value = data?.list || [];
    setTotal(data?.total || 0);
  } finally {
    loading.value = false;
  }
};

// 懒加载：使用 IntersectionObserver 监听滚动到底部
onMounted(() => {
  fetchData();

  if (loadMoreRef.value && process.client) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading.value && videos.value.length < total.value) {
        page.value++;
        loadMore();
      }
    }, { threshold: 0.1 });
    observer.observe(loadMoreRef.value);
    onUnmounted(() => observer.disconnect());
  }
});

const loadMore = async () => {
  loading.value = true;
  try {
    const data = await getVideos({ page: page.value, pageSize: pageSize.value });
    if (data?.list) {
      videos.value = [...videos.value, ...data.list];
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.loading-more {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 20px; color: var(--text-color-secondary);
}
.load-more-trigger { height: 1px; }
</style>
