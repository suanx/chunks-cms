<template>
  <div>
    <div class="page-header">
      <h2>影人列表</h2>
      <el-button type="primary" @click="$router.push('/actor/create')">新建影人</el-button>
    </div>
    <el-card>
      <div class="filter-bar">
        <el-input v-model="keyword" placeholder="搜索影人" clearable style="width:240px" @keyup.enter="fetchData" />
      </div>
      <DataTable :data="tableData" :loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">{{ row.name?.charAt(0) }}</el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="englishName" label="英文名" min-width="120" />
        <el-table-column label="出生日期" width="120">
          <template #default="{ row }">{{ formatDate(row.birthDate) }}</template>
        </el-table-column>
        <el-table-column prop="birthPlace" label="出生地" width="140" show-overflow-tooltip />
        <el-table-column prop="worksCount" label="作品数" width="80" />
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

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editVisible" title="编辑影人" width="600px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="姓名" required><el-input v-model="editForm.name" /></el-form-item>
        <el-form-item label="英文名"><el-input v-model="editForm.englishName" /></el-form-item>
        <el-form-item label="头像"><UploadImage v-model="editForm.avatar" /></el-form-item>
        <el-form-item label="出生日期"><el-date-picker v-model="editForm.birthDate" type="date" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="出生地"><el-input v-model="editForm.birthPlace" /></el-form-item>
        <el-form-item label="身高(cm)"><el-input-number v-model="editForm.height" :min="0" :max="300" /></el-form-item>
        <el-form-item label="简介"><el-input v-model="editForm.biography" type="textarea" :rows="4" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSaveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getActors, updateActor, deleteActor } from '@/api/modules/actor';
import DataTable from '@/components/table/DataTable.vue';
import UploadImage from '@/components/form/UploadImage.vue';
import { useTable } from '@/hooks/useTable';
import { formatDate } from '@/utils/format';
import { ElMessage } from 'element-plus';

const keyword = ref('');
const { tableData, loading, page, pageSize, total, fetchData, handlePageChange, handleSizeChange } = useTable((params) =>
  getActors({ ...params, keyword: keyword.value })
);

onMounted(fetchData);

const editVisible = ref(false);
const saving = ref(false);
const editForm = reactive<any>({ id: 0, name: '', englishName: '', avatar: '', birthDate: '', birthPlace: '', height: 0, biography: '' });

const handleEdit = (row: any) => {
  Object.assign(editForm, row);
  editVisible.value = true;
};

const handleSaveEdit = async () => {
  saving.value = true;
  try {
    await updateActor(editForm.id, editForm);
    ElMessage.success('更新成功');
    editVisible.value = false;
    fetchData();
  } catch (e) { /* handled */ }
  saving.value = false;
};

const handleDelete = async (id: number) => {
  await deleteActor(id);
  ElMessage.success('删除成功');
  fetchData();
};
</script>

<style scoped>
.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; }
</style>
