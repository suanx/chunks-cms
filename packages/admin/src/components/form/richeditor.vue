<template>
  <el-input v-model="content" type="textarea" :rows="6" placeholder="请输入内容..." />
</template>

<script setup lang="ts">
const content = defineModel<string>();
</script>
