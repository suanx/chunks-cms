<template>
  <div class="comment-item">
    <el-avatar :size="36" :src="comment.avatar">{{ comment.username?.charAt(0) }}</el-avatar>
    <div class="comment-body">
      <div class="comment-header">
        <span class="username">{{ comment.username }}</span>
        <span class="time">{{ new Date(comment.createdAt).toLocaleString('zh-CN') }}</span>
      </div>
      <p class="content">{{ comment.content }}</p>
      <div class="comment-actions">
        <el-button text size="small" @click="$emit('reply', comment)">回复</el-button>
      </div>
      <div v-if="comment.replies?.length" class="replies">
        <CommentItem v-for="reply in comment.replies" :key="reply.id" :comment="reply" @reply="$emit('reply', $event)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ comment: any }>();
defineEmits(['reply']);
</script>

<style scoped lang="scss">
.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color-lighter);
}
.comment-body { flex: 1; }
.comment-header { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
.username { font-weight: 500; font-size: 14px; }
.time { font-size: 12px; color: var(--text-color-secondary); }
.content { font-size: 14px; line-height: 1.6; margin-bottom: 6px; }
.comment-actions { font-size: 12px; }
.replies { margin-left: 48px; }
</style>
