<template>
  <div>
    <div class="page-header"><h2>新建影视剧</h2></div>
    <el-card>
      <el-form :model="form" label-width="100px" style="max-width: 800px">
        <el-form-item label="标题" required><el-input v-model="form.title" placeholder="影视剧标题" /></el-form-item>
        <el-form-item label="原名"><el-input v-model="form.originalTitle" placeholder="原始名称（选填）" /></el-form-item>
        <el-form-item label="类型" required>
          <el-select v-model="form.type" placeholder="选择类型" style="width:100%">
            <el-option label="电影" :value="1" /><el-option label="电视剧" :value="2" />
            <el-option label="综艺" :value="3" /><el-option label="动漫" :value="4" />
            <el-option label="纪录片" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <CategoryTree v-model="form.categoryId" :treeData="categoryTree" />
        </el-form-item>
        <el-form-item label="类型标签"><el-input v-model="form.genre" placeholder="如：剧情, 动作, 科幻" /></el-form-item>
        <el-form-item label="地区"><el-input v-model="form.region" placeholder="如：中国大陆" /></el-form-item>
        <el-form-item label="语言"><el-input v-model="form.language" placeholder="如：汉语普通话" /></el-form-item>
        <el-form-item label="年份"><el-input-number v-model="form.releaseYear" :min="1900" :max="2099" /></el-form-item>
        <el-form-item label="导演"><el-input v-model="form.director" placeholder="导演姓名" /></el-form-item>
        <el-form-item label="演员"><el-input v-model="form.actorsDesc" type="textarea" :rows="2" placeholder="演员描述" /></el-form-item>
        <el-form-item label="简介"><el-input v-model="form.description" type="textarea" :rows="4" placeholder="影视剧简介" /></el-form-item>
        <el-form-item label="封面"><UploadImage v-model="form.coverUrl" /></el-form-item>
        <el-form-item label="背景图"><UploadImage v-model="form.backdropUrl" /></el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { createMovie } from '@/api/modules/movie';
import { getCategoryTree } from '@/api/modules/category';
import UploadImage from '@/components/form/UploadImage.vue';
import CategoryTree from '@/components/form/CategoryTree.vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const saving = ref(false);
const categoryTree = ref<any[]>([]);

const form = reactive({
  title: '', originalTitle: '', type: 1, genre: '', region: '', language: '',
  releaseYear: new Date().getFullYear(), director: '', actorsDesc: '', description: '',
  coverUrl: '', backdropUrl: '', categoryId: undefined as number | undefined,
});

onMounted(async () => {
  try {
    categoryTree.value = await getCategoryTree();
  } catch (e) { /* ignore */ }
});

const handleSave = async () => {
  if (!form.title || !form.type) { ElMessage.warning('请填写标题并选择类型'); return; }
  saving.value = true;
  try { await createMovie(form); ElMessage.success('创建成功'); router.push('/movie'); }
  catch (e) { /* handled */ }
  saving.value = false;
};
</script>
