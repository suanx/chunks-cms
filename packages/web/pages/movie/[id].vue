<template>
  <div class="container page">
    <MovieDetail v-if="movie" :movie="movie" />
    <EpisodeList v-if="movie?.episodes?.length" :episodes="movie.episodes" :active-id="activeEpId" @select="playEpisode" />
    <VideoPlayer v-if="currentVideoSrc" :src="currentVideoSrc" style="margin-top: 20px" />
    <CommentList :comments="comments" @submit="handleComment" style="margin-top: 30px" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const movie = ref<any>(null);
const comments = ref<any[]>([]);
const activeEpId = ref<number>();
const currentVideoSrc = ref('');

const playEpisode = (ep: any) => {
  activeEpId.value = ep.id;
  currentVideoSrc.value = ep.videoUrl;
};

onMounted(async () => {
  const { api } = useApi();
  movie.value = await api.get(`/movies/${route.params.id}`);
});

const handleComment = async (content: string) => {
  const { api } = useApi();
  await api.post('/comments', { content, movieId: Number(route.params.id) });
};
</script>
