<template>
  <div class="container page">
    <h1 class="section-title">个人中心</h1>
    <el-card>
      <el-form label-width="80px">
        <el-form-item label="用户名"><el-input v-model="form.username" disabled /></el-form-item>
        <el-form-item label="昵称"><el-input v-model="form.nickname" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
        <el-form-item label="简介"><el-input v-model="form.bio" type="textarea" /></el-form-item>
        <el-form-item><el-button type="primary">保存</el-button></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '个人中心' });
definePageMeta({ middleware: 'auth' });
const form = reactive({ username: '', nickname: '', email: '', bio: '' });
</script>
