<template>
  <div class="comment-list">
    <h3>评论 ({{ comments.length }})</h3>
    <CommentForm @submit="$emit('submit', $event)" />
    <CommentItem v-for="item in comments" :key="item.id" :comment="item" @reply="$emit('reply', $event)" />
    <el-empty v-if="!comments.length" description="暂无评论" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ comments: any[] }>();
defineEmits(['submit', 'reply']);
</script>

<style scoped lang="scss">
.comment-list h3 { margin-bottom: 16px; font-size: 18px; }
</style>
