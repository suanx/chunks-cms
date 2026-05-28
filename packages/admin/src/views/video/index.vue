<template>
  <div>
    <div class="page-header">
      <h2>视频列表</h2>
      <div class="page-header-actions">
        <el-button @click="handleExport" :loading="exporting">导出 Excel</el-button>
        <el-button type="primary" @click="$router.push('/video/create')">新建视频</el-button>
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
      </div>
      <el-space v-if="selectedIds.length" style="margin-bottom: 12px">
        <span>已选 {{ selectedIds.length }} 项</span>
        <el-button type="success" size="small" @click="batchStatus(1)">批量发布</el-button>
        <el-button type="warning" size="small" @click="batchStatus(0)">批量下架</el-button>
        <el-popconfirm title="确定批量删除?" @confirm="batchDelete">
          <template #reference><el-button type="danger" size="small">批量删除</el-button></template>
        </el-popconfirm>
      </el-space>
      <DataTable :data="tableData" :loading="loading" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="viewCount" label="播放量" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="(VIDEO_STATUS[row.status]?.type as any)">{{ VIDEO_STATUS[row.status]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="$router.push(`/video/edit/${row.id}`)">编辑</el-button>
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
import { getVideos, deleteVideo } from '@/api/modules/video';
import api from '@/api';
import DataTable from '@/components/table/DataTable.vue';
import { useTable } from '@/hooks/useTable';
import { formatDateTime } from '@/utils/format';
import { ElMessage } from 'element-plus';

const VIDEO_STATUS: Record<number, { label: string; type: string }> = {
  0: { label: '草稿', type: 'info' },
  1: { label: '已发布', type: 'success' },
  2: { label: '已下架', type: 'danger' },
};

const {
  tableData, loading, page, pageSize, total, searchKeyword, filterStatus,
  fetchData, handlePageChange, handleDelete,
} = useTable({
  fetchApi: getVideos,
  deleteApi: deleteVideo,
});

// 批量操作
const selectedIds = ref<number[]>([]);
const onSelectionChange = (rows: any[]) => { selectedIds.value = rows.map((r: any) => r.id); };

const batchStatus = async (status: number) => {
  await api.patch('/videos/batch/status', { ids: selectedIds.value, status });
  ElMessage.success('操作成功');
  selectedIds.value = [];
  fetchData();
};

const batchDelete = async () => {
  await api.delete('/videos/batch', { data: { ids: selectedIds.value } });
  ElMessage.success('删除成功');
  selectedIds.value = [];
  fetchData();
};

// 数据导出
const exporting = ref(false);
const handleExport = async () => {
  exporting.value = true;
  try {
    const response = await api.get('/videos/export', { responseType: 'blob' });
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `videos_${new Date().toISOString().slice(0, 10)}.xlsx`;
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
