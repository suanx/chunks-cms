<template>
  <div class="dashboard">
    <h2>仪表盘</h2>
    <!-- 统计卡片行 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <StatsCard label="总用户数" :value="stats.totalUsers" icon="User" color="#409eff" />
      </el-col>
      <el-col :span="6">
        <StatsCard label="总视频数" :value="stats.totalVideos" icon="VideoCamera" color="#67c23a" />
      </el-col>
      <el-col :span="6">
        <StatsCard label="总影视剧" :value="stats.totalMovies" icon="Film" color="#e6a23c" />
      </el-col>
      <el-col :span="6">
        <StatsCard label="总播放量" :value="formatNumber(stats.totalViews)" icon="View" color="#f56c6c" />
      </el-col>
    </el-row>

    <!-- 趋势图表 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>播放趋势 (近7天)</template>
          <div ref="trendChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>内容分布</template>
          <div ref="pieChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户活跃度 + 最新视频 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>用户活跃时段</template>
          <div ref="heatmapRef" style="height: 250px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>最新视频</template>
          <div v-for="v in latestVideos" :key="v.id" class="latest-item">
            <span class="text-ellipsis" style="flex:1">{{ v.title }}</span>
            <span class="time">{{ formatDate(v.createdAt) }}</span>
          </div>
          <el-empty v-if="!latestVideos.length" description="暂无数据" :image-size="60" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import StatsCard from '@/components/common/StatsCard.vue';
import { getStats } from '@/api/modules/dashboard';
import { formatNumber, formatDate } from '@/utils/format';

const stats = reactive({ totalUsers: 0, totalVideos: 0, totalMovies: 0, totalViews: 0 });
const latestVideos = ref<any[]>([]);

const trendChartRef = ref<HTMLElement>();
const pieChartRef = ref<HTMLElement>();
const heatmapRef = ref<HTMLElement>();

let trendChart: echarts.ECharts | null = null;
let pieChart: echarts.ECharts | null = null;
let heatmapChart: echarts.ECharts | null = null;

const initTrendChart = () => {
  if (!trendChartRef.value) return;
  trendChart = echarts.init(trendChartRef.value);
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['播放量', '新用户'] },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
    yAxis: { type: 'value' },
    series: [
      { name: '播放量', type: 'line', smooth: true, data: [820, 932, 901, 1234, 1290, 1330, 1320], areaStyle: { opacity: 0.3 } },
      { name: '新用户', type: 'bar', data: [120, 200, 150, 80, 70, 110, 160] },
    ],
  });
};

const initPieChart = () => {
  if (!pieChartRef.value) return;
  pieChart = echarts.init(pieChartRef.value);
  pieChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['40%', '70%'],
      data: [
        { value: 35, name: '视频' },
        { value: 25, name: '电影' },
        { value: 20, name: '电视剧' },
        { value: 10, name: '动漫' },
        { value: 10, name: '综艺' },
      ],
    }],
  });
};

const initHeatmap = () => {
  if (!heatmapRef.value) return;
  heatmapChart = echarts.init(heatmapRef.value);
  // 简单的柱状图模拟活跃时段
  heatmapChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'],
    },
    yAxis: { type: 'value', name: '活跃用户' },
    series: [{
      type: 'bar',
      data: [30, 15, 8, 5, 20, 60, 120, 95, 80, 150, 220, 130],
      itemStyle: {
        color: (params: any) => {
          const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
          return colors[params.dataIndex % colors.length];
        },
      },
    }],
  });
};

const handleResize = () => {
  trendChart?.resize();
  pieChart?.resize();
  heatmapChart?.resize();
};

onMounted(async () => {
  try {
    const data = await getStats();
    Object.assign(stats, data);
    if (data.latestVideos) latestVideos.value = data.latestVideos;
  } catch (e) { console.error(e); }

  await nextTick();
  initTrendChart();
  initPieChart();
  initHeatmap();

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  trendChart?.dispose();
  pieChart?.dispose();
  heatmapChart?.dispose();
});
</script>

<style scoped lang="scss">
.stats-row { margin-bottom: 20px; }
.latest-item {
  display: flex; align-items: center; padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
  &:last-child { border-bottom: none; }
}
.time { font-size: 12px; color: #999; margin-left: 12px; white-space: nowrap; }
.text-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
