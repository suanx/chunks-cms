<template>
  <div class="error-page">
    <el-result :icon="error.statusCode === 404 ? 'warning' : 'error'" :title="error.statusCode === 404 ? '页面不存在' : '出错了'"
      :sub-title="error.message">
      <template #extra>
        <el-button type="primary" @click="handleError">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: { statusCode: number; message: string };
}>();

const handleError = () => clearError({ redirect: '/' });
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
