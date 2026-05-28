<template>
  <div>
    <div class="page-header"><h2>系统设置</h2></div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本设置" name="basic">
        <el-card>
          <el-form :model="settings" label-width="120px" style="max-width:600px">
            <el-form-item label="站点名称"><el-input v-model="settings.siteName" /></el-form-item>
            <el-form-item label="站点描述"><el-input v-model="settings.siteDescription" type="textarea" /></el-form-item>
            <el-form-item label="Logo"><UploadImage v-model="settings.logo" /></el-form-item>
            <el-form-item label="ICP备案号"><el-input v-model="settings.icpNumber" /></el-form-item>
            <el-form-item><el-button type="primary" @click="saveSettings">保存</el-button></el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="安全设置" name="security">
        <el-card>
          <el-form label-width="140px" style="max-width:600px">
            <el-form-item label="密码最小长度"><el-input-number v-model="settings.minPasswordLength" :min="6" :max="20" /></el-form-item>
            <el-form-item label="登录失败锁定"><el-switch v-model="settings.loginLockEnabled" /></el-form-item>
            <el-form-item label="锁定次数"><el-input-number v-model="settings.loginLockCount" :min="3" :max="20" :disabled="!settings.loginLockEnabled" /></el-form-item>
            <el-form-item label="JWT 过期时间"><el-input-number v-model="settings.jwtExpiryHours" :min="1" :max="72" /> 小时</el-form-item>
            <el-form-item><el-button type="primary" @click="saveSettings">保存</el-button></el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="上传设置" name="upload">
        <el-card>
          <el-form label-width="140px" style="max-width:600px">
            <el-form-item label="最大上传大小"><el-input-number v-model="settings.maxUploadSizeMB" :min="10" :max="2000" /> MB</el-form-item>
            <el-form-item label="允许的视频格式"><el-input v-model="settings.allowedVideoFormats" placeholder="mp4,webm,mov" /></el-form-item>
            <el-form-item label="允许的图片格式"><el-input v-model="settings.allowedImageFormats" placeholder="jpg,png,webp,gif" /></el-form-item>
            <el-form-item><el-button type="primary" @click="saveSettings">保存</el-button></el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import UploadImage from '@/components/form/UploadImage.vue';

const activeTab = ref('basic');
const settings = reactive({
  siteName: '淳渔 CMS',
  siteDescription: '影视内容管理系统',
  logo: '',
  icpNumber: '',
  minPasswordLength: 8,
  loginLockEnabled: true,
  loginLockCount: 5,
  jwtExpiryHours: 24,
  maxUploadSizeMB: 500,
  allowedVideoFormats: 'mp4,webm,mov',
  allowedImageFormats: 'jpg,png,webp,gif',
});

const saveSettings = () => {
  ElMessage.success('设置已保存（功能开发中）');
};
</script>
