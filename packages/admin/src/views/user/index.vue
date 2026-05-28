<template>
  <div>
    <div class="page-header">
      <h2>用户列表</h2>
    </div>
    <el-card>
      <div class="filter-bar">
        <el-input v-model="keyword" placeholder="搜索用户" clearable style="width:240px" @keyup.enter="fetchData" />
        <el-select v-model="status" placeholder="状态" clearable style="width:120px" @change="fetchData">
          <el-option label="正常" :value="1" /><el-option label="禁用" :value="0" />
        </el-select>
      </div>
      <DataTable :data="tableData" :loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="(USER_STATUS[row.status]?.type as any)">{{ USER_STATUS[row.status]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="150">
          <template #default="{ row }">
            <el-tag v-for="role in (row.roles || [])" :key="role" size="small" style="margin-right:4px">{{ role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="180">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-popconfirm :title="row.status === 1 ? '确定禁用此用户?' : '确定启用此用户?'"
              @confirm="handleToggleStatus(row)">
              <template #reference>
                <el-button text :type="row.status === 1 ? 'danger' : 'success'">
                  {{ row.status === 1 ? '禁用' : '启用' }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </DataTable>
      <div class="pagination-wrap">
        <el-pagination :current-page="page" :page-size="pageSize" :total="total" layout="total, prev, pager, next"
          @current-change="handlePageChange" @size-change="handleSizeChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getUsers, updateUserStatus } from '@/api/modules/user';
import DataTable from '@/components/table/DataTable.vue';
import { useTable } from '@/hooks/useTable';
import { formatDateTime } from '@/utils/format';
import { USER_STATUS } from '@/utils/constants';
import { ElMessage } from 'element-plus';

const keyword = ref('');
const status = ref<number | undefined>();
const { tableData, loading, page, pageSize, total, fetchData, handlePageChange, handleSizeChange } = useTable((params) =>
  getUsers({ ...params, keyword: keyword.value, status: status.value })
);

onMounted(fetchData);

const handleToggleStatus = async (row: any) => {
  const newStatus = row.status === 1 ? 0 : 1;
  try {
    await updateUserStatus(row.id, newStatus);
    row.status = newStatus;
    ElMessage.success('状态已更新');
  } catch (e) { /* handled */ }
};
</script>

<style scoped>
.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; }
</style>
