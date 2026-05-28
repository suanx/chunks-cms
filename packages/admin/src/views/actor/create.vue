<template>
  <div>
    <div class="page-header"><h2>新建影人</h2></div>
    <el-card>
      <el-form :model="form" label-width="80px" style="max-width: 700px">
        <el-form-item label="姓名" required><el-input v-model="form.name" placeholder="影人姓名" /></el-form-item>
        <el-form-item label="英文名"><el-input v-model="form.englishName" placeholder="英文名" /></el-form-item>
        <el-form-item label="头像"><UploadImage v-model="form.avatar" /></el-form-item>
        <el-form-item label="出生日期"><el-date-picker v-model="form.birthDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" /></el-form-item>
        <el-form-item label="出生地"><el-input v-model="form.birthPlace" placeholder="出生地" /></el-form-item>
        <el-form-item label="身高(cm)"><el-input-number v-model="form.height" :min="0" :max="300" /></el-form-item>
        <el-form-item label="简介"><el-input v-model="form.biography" type="textarea" :rows="4" placeholder="人物简介" /></el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { createActor } from '@/api/modules/actor';
import UploadImage from '@/components/form/UploadImage.vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const saving = ref(false);
const form = reactive({
  name: '', englishName: '', avatar: '', birthDate: '', birthPlace: '', height: 0, biography: '',
});

const handleSave = async () => {
  if (!form.name) { ElMessage.warning('请填写影人姓名'); return; }
  saving.value = true;
  try { await createActor(form); ElMessage.success('创建成功'); router.push('/actor'); }
  catch (e) { /* handled */ }
  saving.value = false;
};
</script>
