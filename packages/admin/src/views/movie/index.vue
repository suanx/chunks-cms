<template>
  <div>
    <div class="page-header">
      <h2>影视剧列表</h2>
      <div class="page-header-actions">
        <el-button @click="handleExport" :loading="exporting">导出 Excel</el-button>
        <el-button type="primary" @click="$router.push('/movie/create')">新建影视剧</el-button>
      </div>
    </div>
    <el-card>
      <div class="filter-bar">
        <el-input v-model="searchKeyword" placeholder="搜索标题..." clearable style="width: 200px" @clear="fetchData" @keyup.enter="fetchData" />
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 120px" @change="fetchData">
          <el-option label="草稿" :value="0" />
          <el-option label="已发布" :value="1" />
          <el-option label="已下架" :value="2" />
        </el-select>
        <el-select v-model="filterType" placeholder="类型" clearable style="width: 120px" @change="fetchData">
          <el-option label="电影" :value="1" />
          <el-option label="电视剧" :value="2" />
          <el-option label="动漫" :value="3" />
          <el-option label="综艺" :value="4" />
        </el-select>
      </div>
      <DataTable :data="tableData" :loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">{{ MOVIE_TYPE[row.type] || '-' }}</template>
        </el-table-column>
        <el-table-column prop="releaseYear" label="年份" width="80" />
        <el-table-column prop="rateAvg" label="评分" width="80">
          <template #default="{ row }">{{ row.rateAvg ? row.rateAvg.toFixed(1) : '-' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="(MOVIE_STATUS[row.status]?.type as any)">{{ MOVIE_STATUS[row.status]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="$router.push(`/movie/edit/${row.id}`)">编辑</el-button>
            <el-popconfirm title="确定删除?" @confirm="handleDelete(row.id)">
              <template #reference><el-button text type="danger">删除</el-button></template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </DataTable>
      <div class="pagination-wrap">
        <el-pagination :current-page="page" :page-size="pageSize" :total="total" layout="total, prev, pager, next"
          @current-change="handlePageChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getMovies, deleteMovie } from '@/api/modules/movie';
import api from '@/api';
import DataTable from '@/components/table/DataTable.vue';
import { useTable } from '@/hooks/useTable';
import { formatDateTime } from '@/utils/format';
import { ElMessage } from 'element-plus';

const MOVIE_TYPE: Record<number, string> = { 1: '电影', 2: '电视剧', 3: '动漫', 4: '综艺' };
const MOVIE_STATUS: Record<number, { label: string; type: string }> = {
  0: { label: '草稿', type: 'info' },
  1: { label: '已发布', type: 'success' },
  2: { label: '已下架', type: 'danger' },
};

const {
  tableData, loading, page, pageSize, total, searchKeyword, filterStatus,
  fetchData, handlePageChange, handleDelete,
} = useTable({
  fetchApi: getMovies,
  deleteApi: deleteMovie,
});

const filterType = ref('');

// 数据导出
const exporting = ref(false);
const handleExport = async () => {
  exporting.value = true;
  try {
    const response = await api.get('/movies/export', { responseType: 'blob' });
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movies_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    ElMessage.success('导出成功');
  } catch (e) { ElMessage.error('导出失败'); }
  exporting.value = false;
};
</script>

<style scoped>
.page-header-actions { display: flex; gap: 8px; }
.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
