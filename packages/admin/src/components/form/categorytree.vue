<template>
  <el-tree-select :data="treeData" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)"
    :props="{ label: 'name', value: 'id', children: 'children' }" placeholder="选择分类" clearable check-strictly />
</template>

<script setup lang="ts">
defineProps<{ modelValue?: number; treeData: any[] }>();
defineEmits(['update:modelValue']);
</script>
