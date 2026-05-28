<template>
  <div class="favorite-folders">
    <div class="folders-header">
      <h3>我的收藏夹</h3>
      <el-button type="primary" size="small" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon> 新建收藏夹
      </el-button>
    </div>
    <div class="folders-grid">
      <div v-for="folder in folders" :key="folder.id" class="folder-card" @click="$emit('select', folder)">
        <div class="folder-icon">📁</div>
        <div class="folder-info">
          <h4>{{ folder.name }}</h4>
          <p>{{ folder.description || '暂无描述' }}</p>
        </div>
        <div class="folder-actions">
          <el-button text size="small" @click.stop="editFolder(folder)">编辑</el-button>
          <el-popconfirm title="确定删除?" @confirm="deleteFolder(folder.id)">
            <template #reference><el-button text size="small" type="danger" @click.stop>删除</el-button></template>
          </el-popconfirm>
        </div>
      </div>
    </div>

    <el-dialog v-model="showCreateDialog" :title="editingFolder ? '编辑收藏夹' : '新建收藏夹'" width="400px">
      <el-form :model="folderForm" label-width="80px">
        <el-form-item label="名称"><el-input v-model="folderForm.name" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="folderForm.description" type="textarea" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="saveFolder">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

defineEmits(['select']);
const { api } = useApi();
const folders = ref<any[]>([]);
const showCreateDialog = ref(false);
const editingFolder = ref<any>(null);
const folderForm = reactive({ name: '', description: '' });

const loadFolders = async () => {
  try { folders.value = await api.get('/favorites/folders'); } catch (e) { /* */ }
};

const editFolder = (folder: any) => {
  editingFolder.value = folder;
  folderForm.name = folder.name;
  folderForm.description = folder.description;
  showCreateDialog.value = true;
};

const saveFolder = async () => {
  try {
    if (editingFolder.value) {
      await api.patch(`/favorites/folders/${editingFolder.value.id}`, folderForm);
    } else {
      await api.post('/favorites/folders', folderForm);
    }
    ElMessage.success('保存成功');
    showCreateDialog.value = false;
    editingFolder.value = null;
    folderForm.name = '';
    folderForm.description = '';
    loadFolders();
  } catch (e) { ElMessage.error('保存失败'); }
};

const deleteFolder = async (id: number) => {
  try { await api.delete(`/favorites/folders/${id}`); ElMessage.success('删除成功'); loadFolders(); }
  catch (e) { ElMessage.error('删除失败'); }
};

onMounted(loadFolders);
</script>

<style scoped lang="scss">
.folders-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.folders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.folder-card {
  display: flex; align-items: center; gap: 12px; padding: 16px;
  background: #fff; border-radius: 8px; cursor: pointer;
  transition: box-shadow 0.2s; border: 1px solid var(--border-color-lighter);
  &:hover { box-shadow: var(--shadow-base); }
}
.folder-icon { font-size: 32px; }
.folder-info { flex: 1; h4 { margin-bottom: 4px; } p { font-size: 12px; color: var(--text-color-secondary); } }
.folder-actions { display: flex; gap: 4px; }
</style>
