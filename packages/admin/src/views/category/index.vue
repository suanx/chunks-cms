<template>
  <div>
    <div class="page-header">
      <h2>分类管理</h2>
      <el-button type="primary" @click="handleAdd(null)">新建分类</el-button>
    </div>
    <el-card>
      <el-table :data="categoryTree" row-key="id" border default-expand-all v-loading="loading">
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column prop="slug" label="别名" width="160" />
        <el-table-column prop="sortOrder" label="排序" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="handleAdd(row)">添加子分类</el-button>
            <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除此分类?" @confirm="handleDelete(row.id)">
              <template #reference><el-button text type="danger">删除</el-button></template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新建/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑分类' : '新建分类'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称" required><el-input v-model="form.name" placeholder="分类名称" /></el-form-item>
        <el-form-item label="别名"><el-input v-model="form.slug" placeholder="URL 别名（选填）" /></el-form-item>
        <el-form-item label="父分类">
          <el-tree-select v-model="form.parentId" :data="categoryTree" :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="无则为顶级分类" clearable check-strictly style="width:100%" />
        </el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getCategoryTree, createCategory, updateCategory, deleteCategory } from '@/api/modules/category';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const saving = ref(false);
const categoryTree = ref<any[]>([]);
const dialogVisible = ref(false);
const editingId = ref<number | null>(null);

const form = reactive({
  name: '', slug: '', parentId: null as number | null, sortOrder: 0, isActive: true,
});

const fetchTree = async () => {
  loading.value = true;
  try { categoryTree.value = await getCategoryTree(); }
  catch (e) { /* handled */ }
  loading.value = false;
};

onMounted(fetchTree);

const handleAdd = (parent: any) => {
  editingId.value = null;
  form.name = '';
  form.slug = '';
  form.parentId = parent?.id || null;
  form.sortOrder = 0;
  form.isActive = true;
  dialogVisible.value = true;
};

const handleEdit = (row: any) => {
  editingId.value = row.id;
  form.name = row.name;
  form.slug = row.slug || '';
  form.parentId = row.parentId || null;
  form.sortOrder = row.sortOrder || 0;
  form.isActive = row.isActive !== false;
  dialogVisible.value = true;
};

const handleSave = async () => {
  if (!form.name) { ElMessage.warning('请输入分类名称'); return; }
  saving.value = true;
  try {
    if (editingId.value) {
      await updateCategory(editingId.value, { ...form });
      ElMessage.success('更新成功');
    } else {
      await createCategory({ ...form });
      ElMessage.success('创建成功');
    }
    dialogVisible.value = false;
    fetchTree();
  } catch (e) { /* handled */ }
  saving.value = false;
};

const handleDelete = async (id: number) => {
  await deleteCategory(id);
  ElMessage.success('删除成功');
  fetchTree();
};
</script>
