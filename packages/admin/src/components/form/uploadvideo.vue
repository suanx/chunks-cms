<template>
  <div>
    <el-upload :action="uploadUrl" :headers="headers" :before-upload="beforeUpload" :on-success="handleSuccess"
      :file-list="fileList" accept="video/mp4,video/webm">
      <el-button type="primary" size="small">上传视频</el-button>
      <template #tip><div class="el-upload__tip">支持 mp4/webm，最大 500MB</div></template>
    </el-upload>
    <video v-if="modelValue" :src="modelValue" controls style="max-width:400px;margin-top:10px" />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';

defineProps<{ modelValue?: string }>();
const emit = defineEmits(['update:modelValue']);
const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/upload`;
const headers = computed(() => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` }));
const fileList = ref<any[]>([]);

const beforeUpload = (file: File) => {
  if (file.size / 1024 / 1024 > 500) { ElMessage.error('视频不能超过 500MB'); return false; }
  return true;
};
const handleSuccess = (res: any) => { emit('update:modelValue', res.data?.url || res.url); };
</script>
