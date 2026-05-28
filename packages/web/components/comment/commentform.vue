<template>
  <div class="comment-form">
    <el-input v-model="content" type="textarea" :rows="3" placeholder="发表评论..." maxlength="500" show-word-limit />
    <div class="form-actions">
      <el-button type="primary" size="small" :disabled="!content.trim()" @click="handleSubmit">发表</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const content = ref('');
const emit = defineEmits(['submit']);
const handleSubmit = () => {
  if (!content.value.trim()) return;
  emit('submit', content.value.trim());
  content.value = '';
};
</script>

<style scoped lang="scss">
.comment-form { margin-bottom: 20px; }
.form-actions { display: flex; justify-content: flex-end; margin-top: 8px; }
</style>
