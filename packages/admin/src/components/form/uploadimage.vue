<template>
  <el-upload class="upload-image" :action="uploadUrl" :headers="headers" :show-file-list="false"
    :before-upload="beforeUpload" :on-success="handleSuccess" accept="image/*">
    <img v-if="modelValue" :src="modelValue" class="preview" />
    <el-icon v-else class="upload-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const props = defineProps<{ modelValue?: string }>();
const emit = defineEmits(['update:modelValue']);

const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/upload`;
const headers = computed(() => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
}));

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isImage) { ElMessage.error('只能上传图片文件'); return false; }
  if (!isLt10M) { ElMessage.error('图片大小不能超过 10MB'); return false; }
  return true;
};

const handleSuccess = (res: any) => { emit('update:modelValue', res.data?.url || res.url); };
</script>

<style scoped lang="scss">
.upload-image {
  :deep(.el-upload) {
    width: 120px; height: 120px; border-radius: 6px; border: 1px dashed #d9d9d9;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    overflow: hidden;
  }
  .preview { width: 100%; height: 100%; object-fit: cover; }
  .upload-icon { font-size: 28px; color: #8c939d; }
}
</style>
