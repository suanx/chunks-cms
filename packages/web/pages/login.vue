<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2>登录</h2>
      <el-form :model="form" label-width="0">
        <el-form-item><el-input v-model="form.username" placeholder="用户名" prefix-icon="User" /></el-form-item>
        <el-form-item><el-input v-model="form.password" type="password" placeholder="密码" show-password /></el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'blank' });
const form = reactive({ username: '', password: '' });
const handleLogin = () => { navigateTo('/'); };
</script>

<style scoped lang="scss">
.login-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.login-card { width: 400px; h2 { text-align: center; margin-bottom: 24px; } }
</style>
