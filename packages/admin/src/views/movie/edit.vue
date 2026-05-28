<template>
  <div>
    <div class="page-header"><h2>编辑影视剧</h2></div>
    <el-card v-loading="loading">
      <el-form :model="form" label-width="100px" style="max-width: 800px">
        <el-form-item label="标题" required><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="原名"><el-input v-model="form.originalTitle" /></el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type">
            <el-option label="电影" :value="1" /><el-option label="电视剧" :value="2" />
            <el-option label="动漫" :value="3" /><el-option label="综艺" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="选择分类" clearable>
            <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-tag v-for="(tag, i) in form.tags" :key="i" closable @close="form.tags.splice(i, 1)" style="margin-right:8px">{{ tag }}</el-tag>
          <el-input v-if="tagInputVisible" ref="tagInputRef" v-model="tagInputValue" size="small" style="width: 100px" @keyup.enter="confirmTag" @blur="confirmTag" />
          <el-button v-else size="small" @click="showTagInput">+ 添加标签</el-button>
        </el-form-item>
        <el-form-item label="AI标签">
          <el-button size="small" @click="suggestTags" :loading="suggestingTags">智能推荐标签</el-button>
          <div v-if="suggestedTags.length" class="suggested-tags">
            <el-tag v-for="tag in suggestedTags" :key="tag" size="small" class="tag-item" @click="addTag(tag)">{{ tag }} +</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="年份"><el-input-number v-model="form.releaseYear" :min="1900" :max="2100" /></el-form-item>
        <el-form-item label="地区"><el-input v-model="form.region" /></el-form-item>
        <el-form-item label="语言"><el-input v-model="form.language" /></el-form-item>
        <el-form-item label="导演"><el-input v-model="form.director" placeholder="导演姓名" /></el-form-item>
        <el-form-item label="演员"><el-input v-model="form.actorsDesc" type="textarea" :rows="2" placeholder="演员描述" /></el-form-item>
        <el-form-item label="简介"><el-input v-model="form.description" type="textarea" :rows="4" placeholder="影视剧简介" /></el-form-item>
        <el-form-item label="封面"><UploadImage v-model="form.coverUrl" /></el-form-item>
        <el-form-item label="背景图"><UploadImage v-model="form.backdropUrl" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="发布" inactive-text="草稿" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getMovie, updateMovie } from '@/api/modules/movie';
import { getCategoryTree } from '@/api/modules/category';
import UploadImage from '@/components/form/UploadImage.vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const saving = ref(false);
const categories = ref<any[]>([]);

const form = reactive<any>({
  title: '', originalTitle: '', type: 1, genre: '', region: '', language: '',
  releaseYear: new Date().getFullYear(), director: '', actorsDesc: '', description: '',
  coverUrl: '', backdropUrl: '', categoryId: undefined, status: 0, tags: [],
});

// 标签输入
const tagInputVisible = ref(false);
const tagInputValue = ref('');
const tagInputRef = ref();
const showTagInput = () => {
  tagInputVisible.value = true;
  nextTick(() => tagInputRef.value?.input?.focus());
};
const confirmTag = () => {
  if (tagInputValue.value && !form.tags.includes(tagInputValue.value)) {
    form.tags.push(tagInputValue.value);
  }
  tagInputVisible.value = false;
  tagInputValue.value = '';
};

// AI 标签建议
const suggestingTags = ref(false);
const suggestedTags = ref<string[]>([]);

const suggestTags = async () => {
  suggestingTags.value = true;
  setTimeout(() => {
    suggestedTags.value = ['剧情', '科幻', '2024', '高分', '经典', '获奖'];
    suggestingTags.value = false;
  }, 1000);
};

const addTag = (tag: string) => {
  if (!form.tags) form.tags = [];
  if (!form.tags.includes(tag)) form.tags.push(tag);
};

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    const [movieData, catData] = await Promise.all([getMovie(id), getCategoryTree()]);
    Object.assign(form, movieData);
    categories.value = catData || [];
  } catch (e) { console.error(e); }
  loading.value = false;
});

const handleSave = async () => {
  if (!form.title) return ElMessage.warning('请输入标题');
  saving.value = true;
  try {
    await updateMovie(Number(route.params.id), form);
    ElMessage.success('保存成功');
    router.push('/movie/list');
  } catch (e) { ElMessage.error('保存失败'); }
  saving.value = false;
};
</script>

<style scoped>
.suggested-tags { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; }
.tag-item { cursor: pointer; }
</style>
