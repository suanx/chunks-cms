<template>
  <div>
    <div class="page-header">
      <h2>评论管理</h2>
    </div>
    <el-card>
      <div class="filter-bar">
        <el-input v-model="keyword" placeholder="搜索评论内容" clearable style="width:240px" @keyup.enter="fetchData" />
        <el-select v-model="status" placeholder="状态" clearable style="width:120px" @change="fetchData">
          <el-option label="待审核" :value="0" /><el-option label="已通过" :value="1" />
          <el-option label="已拒绝" :value="2" />
        </el-select>
      </div>
      <DataTable :data="tableData" :loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="内容" min-width="300" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.content?.length > 100 ? row.content.substring(0, 100) + '...' : row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" width="80" />
        <el-table-column prop="videoId" label="视频ID" width="80" />
        <el-table-column prop="movieId" label="影视剧ID" width="80" />
        <el-table-column prop="likeCount" label="点赞数" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : row.status === 2 ? 'danger' : 'warning'">
              {{ row.status === 0 ? '待审核' : row.status === 1 ? '已通过' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-popconfirm title="确定删除此评论?" @confirm="handleDelete(row.id)">
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
  </div>
</template>

<script setup lang="ts">
import { getComments, deleteComment } from '@/api/modules/comment';
import DataTable from '@/components/table/DataTable.vue';
import { useTable } from '@/hooks/useTable';
import { formatDateTime } from '@/utils/format';
import { ElMessage } from 'element-plus';

const keyword = ref('');
const status = ref<number | undefined>();
const { tableData, loading, page, pageSize, total, fetchData, handlePageChange, handleSizeChange } = useTable((params) =>
  getComments({ ...params, keyword: keyword.value, status: status.value })
);

onMounted(fetchData);

const handleDelete = async (id: number) => {
  await deleteComment(id);
  ElMessage.success('删除成功');
  fetchData();
};
</script>

<style scoped>
.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; }
</style>
