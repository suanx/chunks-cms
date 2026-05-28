<template>
  <el-dialog v-model="visible" :title="title" width="400px">
    <p>{{ message }}</p>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="$emit('confirm')">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
defineProps<{ title: string; message: string; loading?: boolean }>();
const visible = defineModel<boolean>();
defineEmits(['confirm']);
</script>
