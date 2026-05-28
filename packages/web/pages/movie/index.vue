<template>
  <div class="container page">
    <h1 class="section-title">影视剧</h1>
    <div class="movie-grid">
      <MovieCard v-for="item in movies" :key="item.id" :movie="item" />
    </div>
    <Pagination v-model:page="page" v-model:pageSize="pageSize" :total="total" @update:page="fetchData" @update:pageSize="fetchData" />
  </div>
</template>

<script setup lang="ts">
useHead({ title: '影视剧' });
const { page, pageSize, total, setTotal } = usePagination();
const movies = ref<any[]>([]);
const { getMovies } = useVideo();

const fetchData = async () => {
  const data = await getMovies({ page: page.value, pageSize: pageSize.value });
  movies.value = data?.list || [];
  setTotal(data?.total || 0);
};

onMounted(fetchData);
</script>

<style scoped lang="scss">
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}
</style>
