<template>
  <div class="search-bar">
    <el-input v-model="keyword" :placeholder="placeholder" clearable @keyup.enter="handleSearch"
      :prefix-icon="Search" size="large" />
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';

const props = defineProps<{ placeholder?: string }>();
const keyword = ref('');
const emit = defineEmits(['search']);
const handleSearch = () => emit('search', keyword.value.trim());
</script>
