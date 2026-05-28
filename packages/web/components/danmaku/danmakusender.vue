<template>
  <div class="danmaku-sender">
    <el-input v-model="content" placeholder="发送弹幕..." size="small" style="width: 200px" @keyup.enter="send">
      <template #append>
        <el-button type="primary" size="small" @click="send" :disabled="!content.trim()">发送</el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ videoId: number; currentTime: number }>();
const content = ref('');
const { api } = useApi();

const send = async () => {
  if (!content.value.trim()) return;
  try {
    await api.post('/danmakus', {
      videoId: props.videoId,
      content: content.value.trim(),
      timePoint: Math.floor(props.currentTime * 1000),
    });
    content.value = '';
  } catch (e) { console.error(e); }
};
</script>
