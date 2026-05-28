<template>
  <div class="container page">
    <VideoPlayer v-if="video" :src="video.videoUrl" :videoId="Number(route.params.id)" :danmakus="danmakus" />
    <div class="video-info" v-if="video">
      <h1>{{ video.title }}</h1>
      <div class="meta">
        <span>{{ video.viewCount }} 次播放</span>
        <span>{{ new Date(video.createdAt).toLocaleDateString('zh-CN') }}</span>
      </div>
      <p class="desc" v-if="video.description">{{ video.description }}</p>
      <div class="video-actions">
        <el-button :type="isFavorited ? 'primary' : 'default'" @click="toggleFavorite">
          <el-icon><Star /></el-icon> {{ isFavorited ? '已收藏' : '收藏' }}
        </el-button>
        <ShareCard :title="video.title" />
      </div>
      <el-popover v-if="isFavorited" trigger="click" :width="280" placement="bottom-start">
        <template #reference>
          <el-button size="small" style="margin-left: 8px">选择收藏夹</el-button>
        </template>
        <div class="folder-select">
          <div v-for="folder in folders" :key="folder.id" class="folder-option" @click="moveToFolder(folder.id)">
            <span>📁 {{ folder.name }}</span>
            <el-icon v-if="video.folderId === folder.id" color="#409eff"><Check /></el-icon>
          </div>
        </div>
      </el-popover>
    </div>
    <CommentList :comments="comments" @submit="handleComment" />
  </div>
</template>

<script setup lang="ts">
import { Star, Check } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const video = ref<any>(null);
const comments = ref<any[]>([]);
const danmakus = ref<any[]>([]);
const isFavorited = ref(false);
const folders = ref<any[]>([]);

onMounted(async () => {
  const { api } = useApi();
  const id = route.params.id;
  video.value = await api.get(`/videos/${id}`);

  // 加载弹幕
  try {
    danmakus.value = await api.get(`/danmakus`, { videoId: id });
  } catch { /* 弹幕加载失败 */ }

  // 加载评论
  try {
    comments.value = await api.get('/comments', { videoId: id });
  } catch { /* 评论加载失败 */ }

  // 检查收藏状态
  try {
    const fav = await api.get(`/favorites/check/${id}`);
    isFavorited.value = fav?.isFavorited || false;
  } catch { /* 未登录 */ }

  // 加载收藏夹列表
  try {
    folders.value = await api.get('/favorites/folders');
  } catch { /* */ }

  // 添加到观看历史
  try {
    const { addToHistory } = useWatchHistory();
    await addToHistory(Number(id), 0, 0);
  } catch { /* */ }
});

useHead({ title: computed(() => video.value?.title || '视频详情') });

const handleComment = async (content: string) => {
  const { api } = useApi();
  await api.post('/comments', { content, videoId: Number(route.params.id) });
  ElMessage.success('评论成功');
  // 重新加载评论
  comments.value = await api.get('/comments', { videoId: route.params.id });
};

const toggleFavorite = async () => {
  const { api } = useApi();
  const id = Number(route.params.id);
  try {
    if (isFavorited.value) {
      await api.delete(`/favorites/${id}`);
      isFavorited.value = false;
      ElMessage.success('已取消收藏');
    } else {
      await api.post('/favorites', { videoId: id });
      isFavorited.value = true;
      ElMessage.success('收藏成功');
    }
  } catch (e) { ElMessage.error('操作失败'); }
};

const moveToFolder = async (folderId: number) => {
  const { api } = useApi();
  const id = Number(route.params.id);
  try {
    await api.patch(`/favorites/${id}`, { folderId });
    video.value.folderId = folderId;
    ElMessage.success('已移动到收藏夹');
  } catch (e) { ElMessage.error('移动失败'); }
};
</script>

<style scoped lang="scss">
.video-info { padding: 20px 0; }
h1 { font-size: 24px; margin-bottom: 8px; }
.meta { color: var(--text-color-secondary); font-size: 14px; margin-bottom: 16px; display: flex; gap: 16px; }
.desc { line-height: 1.8; color: var(--text-color-regular); margin-bottom: 16px; }
.video-actions { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
.folder-select {
  .folder-option {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 12px; border-radius: 6px; cursor: pointer;
    &:hover { background: #f5f7fa; }
  }
}
</style>
