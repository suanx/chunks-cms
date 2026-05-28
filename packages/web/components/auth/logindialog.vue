<template>
  <el-dialog v-model="visible" title="登录" width="400px" :close-on-click-modal="false">
    <el-form :model="form" label-width="0">
      <el-form-item>
        <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" :loading="loading" @click="handleLogin">登录</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const visible = defineModel<boolean>();
const form = reactive({ username: '', password: '' });
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  setTimeout(() => { loading.value = false; visible.value = false; }, 1000);
};
</script>
