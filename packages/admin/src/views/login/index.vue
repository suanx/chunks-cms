<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="title">🎬 淳渔 CMS 管理后台</h2>
      <el-form ref="formRef" :model="form" :rules="rules_" label-width="0" size="large">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="管理员账号" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" show-password
            @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" :loading="loading" @click="handleLogin">登 录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { login, getProfile } from '@/api/modules/auth';
import { useUserStore } from '@/stores';

const userStore = useUserStore();
const router = useRouter();
const formRef = ref();
const loading = ref(false);
const form = reactive({ username: '', password: '' });
const rules_ = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const handleLogin = async () => {
  await formRef.value?.validate();
  loading.value = true;
  try {
    const data = await login(form);
    userStore.setToken(data.accessToken);
    const profile = await getProfile();
    userStore.setUserInfo(profile);
    router.push('/dashboard');
  } catch (e) { /* handled by interceptor */ }
  loading.value = false;
};
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card { width: 420px; padding: 20px; }
.title { text-align: center; margin-bottom: 30px; color: #303133; }
</style>
