<template>
  <div>
    <div class="page-header">
      <h2>角色管理</h2>
      <el-button type="primary" @click="handleAdd">新建角色</el-button>
    </div>
    <el-card>
      <el-table :data="roles" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" min-width="150" />
        <el-table-column prop="code" label="角色编码" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除?" @confirm="handleDelete(row.id)">
              <template #reference><el-button text type="danger">删除</el-button></template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑角色' : '新建角色'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称" required><el-input v-model="form.name" placeholder="角色名称" /></el-form-item>
        <el-form-item label="编码" required><el-input v-model="form.code" placeholder="如：admin, editor" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="3" placeholder="角色描述" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import api from '@/api/index';
import { formatDateTime } from '@/utils/format';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const saving = ref(false);
const roles = ref<any[]>([]);
const dialogVisible = ref(false);
const editingId = ref<number | null>(null);

const form = reactive({ name: '', code: '', description: '' });

const fetchRoles = async () => {
  loading.value = true;
  try {
    const data = await api.get('/roles');
    roles.value = data?.list || data || [];
  } catch (e) { console.error(e); }
  loading.value = false;
};

onMounted(fetchRoles);

const handleAdd = () => {
  editingId.value = null;
  form.name = '';
  form.code = '';
  form.description = '';
  dialogVisible.value = true;
};

const handleEdit = (row: any) => {
  editingId.value = row.id;
  form.name = row.name;
  form.code = row.code;
  form.description = row.description || '';
  dialogVisible.value = true;
};

const handleSave = async () => {
  if (!form.name || !form.code) { ElMessage.warning('请填写角色名称和编码'); return; }
  saving.value = true;
  try {
    if (editingId.value) {
      await api.patch(`/roles/${editingId.value}`, { ...form });
      ElMessage.success('更新成功');
    } else {
      await api.post('/roles', { ...form });
      ElMessage.success('创建成功');
    }
    dialogVisible.value = false;
    fetchRoles();
  } catch (e) { /* handled */ }
  saving.value = false;
};

const handleDelete = async (id: number) => {
  await api.delete(`/roles/${id}`);
  ElMessage.success('删除成功');
  fetchRoles();
};
</script>
