<template>
  <div>
    <div class="page-header"><h2>视频审核</h2></div>
    <el-card>
      <el-table :data="pendingVideos" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column label="封面" width="120">
          <template #default="{ row }">
            <el-image :src="row.coverUrl" style="width:80px;height:45px" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="user" label="上传者" width="120" />
        <el-table-column label="提交时间" width="180">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="handleReview(row.id, 1)">通过</el-button>
            <el-button type="danger" size="small" @click="openReject(row.id)">不通过</el-button>
            <el-button text size="small" @click="previewVideo(row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination :current-page="page" :page-size="pageSize" :total="total" layout="total, prev, pager, next" @current-change="handlePageChange" />
      </div>
    </el-card>

    <!-- 驳回弹窗 -->
    <el-dialog v-model="rejectDialog" title="驳回原因" width="400px">
      <el-input v-model="rejectReason" type="textarea" :rows="4" placeholder="请输入驳回原因..." />
      <template #footer>
        <el-button @click="rejectDialog = false">取消</el-button>
        <el-button type="danger" @click="confirmReject">确认驳回</el-button>
      </template>
    </el-dialog>

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewDialog" title="视频预览" width="720px">
      <video v-if="previewUrl" :src="previewUrl" controls style="width:100%" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getVideos, updateVideo } from '@/api/modules/video';
import { formatDateTime } from '@/utils/format';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const pendingVideos = ref<any[]>([]);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const rejectDialog = ref(false);
const rejectReason = ref('');
const rejectId = ref<number>(0);
const previewDialog = ref(false);
const previewUrl = ref('');

const fetchPending = async () => {
  loading.value = true;
  try {
    const data = await getVideos({ page: page.value, pageSize: pageSize.value, status: 0 });
    pendingVideos.value = data?.list || [];
    total.value = data?.total || 0;
  } catch (e) { /* */ }
  loading.value = false;
};

const handlePageChange = (p: number) => { page.value = p; fetchPending(); };

const handleReview = async (id: number, status: number) => {
  await updateVideo(id, { status });
  ElMessage.success('审核完成');
  fetchPending();
};

const openReject = (id: number) => { rejectId.value = id; rejectReason.value = ''; rejectDialog.value = true; };

const confirmReject = async () => {
  await updateVideo(rejectId.value, { status: 2, rejectReason: rejectReason.value });
  ElMessage.success('已驳回');
  rejectDialog.value = false;
  fetchPending();
};

const previewVideo = (row: any) => { previewUrl.value = row.videoUrl; previewDialog.value = true; };

onMounted(fetchPending);
</script>

<style scoped>
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
