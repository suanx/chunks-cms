<template>
  <el-dialog v-model="visible" title="注册" width="400px" :close-on-click-modal="false">
    <el-form :model="form" label-width="0">
      <el-form-item>
        <el-input v-model="form.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.password" type="password" placeholder="密码" show-password />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.email" placeholder="邮箱（可选）" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="visible = false">注册</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const visible = defineModel<boolean>();
const form = reactive({ username: '', password: '', email: '' });
</script>
