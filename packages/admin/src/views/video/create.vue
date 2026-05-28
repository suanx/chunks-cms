<template>
  <div>
    <div class="page-header"><h2>新建视频</h2></div>
    <el-card>
      <el-form :model="form" label-width="100px" style="max-width: 700px">
        <el-form-item label="标题" required><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="4" /></el-form-item>
        <el-form-item label="封面"><UploadImage v-model="form.coverUrl" /></el-form-item>
        <el-form-item label="视频"><UploadVideo v-model="form.videoUrl" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { createVideo } from '@/api/modules/video';
import UploadImage from '@/components/form/UploadImage.vue';
import UploadVideo from '@/components/form/UploadVideo.vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const saving = ref(false);
const form = reactive({
  title: '', description: '', coverUrl: '', videoUrl: '', sortOrder: 0,
});

const handleSave = async () => {
  if (!form.title || !form.videoUrl) { ElMessage.warning('请填写标题并上传视频'); return; }
  saving.value = true;
  try { await createVideo(form); ElMessage.success('创建成功'); router.push('/video'); }
  catch (e) { /* handled */ }
  saving.value = false;
};
</script>
