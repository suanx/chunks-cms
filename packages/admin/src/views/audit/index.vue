<template>
  <div>
    <div class="page-header"><h2>审计日志</h2></div>
    <el-card>
      <div class="filter-bar">
        <el-select v-model="moduleFilter" placeholder="模块" clearable style="width:140px" @change="fetchData">
          <el-option label="视频" value="video" /><el-option label="用户" value="user" />
          <el-option label="分类" value="category" /><el-option label="评论" value="comment" />
          <el-option label="影视" value="movie" /><el-option label="横幅" value="banner" />
        </el-select>
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="fetchData" />
      </div>
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="module" label="模块" width="100">
          <template #default="{ row }"><el-tag size="small">{{ row.module }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="action" label="操作" width="120" />
        <el-table-column prop="userId" label="操作人" width="100" />
        <el-table-column prop="targetId" label="目标ID" width="100" />
        <el-table-column prop="detail" label="详情" min-width="200" show-overflow-tooltip />
        <el-table-column prop="ip" label="IP" width="130" />
        <el-table-column label="时间" width="180">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination :current-page="page" :page-size="pageSize" :total="total" layout="total, prev, pager, next" @current-change="handlePageChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api from '@/api';
import { formatDateTime } from '@/utils/format';

const loading = ref(false);
const tableData = ref<any[]>([]);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const moduleFilter = ref('');
const dateRange = ref<any>(null);

const fetchData = async () => {
  loading.value = true;
  try {
    const data = await api.get('/audit', {
      params: { page: page.value, pageSize: pageSize.value, module: moduleFilter.value || undefined },
    });
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
  } catch (e) { /* */ }
  loading.value = false;
};

const handlePageChange = (p: number) => { page.value = p; fetchData(); };
onMounted(fetchData);
</script>

<style scoped>
.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
