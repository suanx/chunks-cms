<template>
  <div>
    <div class="page-header">
      <h2>横幅管理</h2>
      <el-button type="primary" @click="handleAdd">新建横幅</el-button>
    </div>
    <el-card>
      <DataTable :data="tableData" :loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图片" width="120">
          <template #default="{ row }">
            <el-image :src="row.imageUrl" style="width:80px;height:45px;object-fit:cover;border-radius:4px"
              :preview-src-list="[row.imageUrl]" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="160" show-overflow-tooltip />
        <el-table-column prop="linkUrl" label="链接" min-width="200" show-overflow-tooltip />
        <el-table-column prop="position" label="位置" width="100" />
        <el-table-column prop="sortOrder" label="排序" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.isActive" @change="handleToggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除?" @confirm="handleDelete(row.id)">
              <template #reference><el-button text type="danger">删除</el-button></template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </DataTable>
      <div class="pagination-wrap">
        <el-pagination :current-page="page" :page-size="pageSize" :total="total" layout="total, prev, pager, next"
          @current-change="handlePageChange" @size-change="handleSizeChange" />
      </div>
    </el-card>

    <!-- 新建/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑横幅' : '新建横幅'" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题" required><el-input v-model="form.title" placeholder="横幅标题" /></el-form-item>
        <el-form-item label="图片" required><UploadImage v-model="form.imageUrl" /></el-form-item>
        <el-form-item label="链接"><el-input v-model="form.linkUrl" placeholder="跳转链接" /></el-form-item>
        <el-form-item label="位置"><el-input v-model="form.position" placeholder="如：首页顶部" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="form.isActive" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/api/modules/banner';
import DataTable from '@/components/table/DataTable.vue';
import UploadImage from '@/components/form/UploadImage.vue';
import { useTable } from '@/hooks/useTable';
import { ElMessage } from 'element-plus';

const dialogVisible = ref(false);
const saving = ref(false);
const editingId = ref<number | null>(null);

const form = reactive({
  title: '', imageUrl: '', linkUrl: '', position: '', sortOrder: 0, isActive: true,
});

const { tableData, loading, page, pageSize, total, fetchData, handlePageChange, handleSizeChange } = useTable((params) =>
  getBanners(params)
);

onMounted(fetchData);

const handleAdd = () => {
  editingId.value = null;
  form.title = '';
  form.imageUrl = '';
  form.linkUrl = '';
  form.position = '';
  form.sortOrder = 0;
  form.isActive = true;
  dialogVisible.value = true;
};

const handleEdit = (row: any) => {
  editingId.value = row.id;
  form.title = row.title;
  form.imageUrl = row.imageUrl;
  form.linkUrl = row.linkUrl || '';
  form.position = row.position || '';
  form.sortOrder = row.sortOrder || 0;
  form.isActive = row.isActive !== false;
  dialogVisible.value = true;
};

const handleSave = async () => {
  if (!form.title || !form.imageUrl) { ElMessage.warning('请填写标题并上传图片'); return; }
  saving.value = true;
  try {
    if (editingId.value) {
      await updateBanner(editingId.value, { ...form });
      ElMessage.success('更新成功');
    } else {
      await createBanner({ ...form });
      ElMessage.success('创建成功');
    }
    dialogVisible.value = false;
    fetchData();
  } catch (e) { /* handled */ }
  saving.value = false;
};

const handleToggleStatus = async (row: any) => {
  try {
    await updateBanner(row.id, { isActive: row.isActive });
    ElMessage.success('状态已更新');
  } catch (e) {
    row.isActive = !row.isActive;
  }
};

const handleDelete = async (id: number) => {
  await deleteBanner(id);
  ElMessage.success('删除成功');
  fetchData();
};
</script>
