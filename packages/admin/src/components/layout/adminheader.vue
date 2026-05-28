<template>
  <div class="header-content">
    <el-icon class="toggle-btn" @click="$emit('toggle')" :size="20">
      <Fold v-if="!collapsed" />
      <Expand v-else />
    </el-icon>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header-right">
      <el-dropdown trigger="click">
        <span class="user-info">
          <el-avatar :size="32">A</el-avatar>
          <span class="username">管理员</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Fold, Expand } from '@element-plus/icons-vue';

defineProps<{ collapsed: boolean }>();
defineEmits(['toggle']);

const router = useRouter();
const handleLogout = () => {
  localStorage.removeItem('admin_token');
  router.push('/login');
};
</script>

<style scoped lang="scss">
.header-content {
  display: flex;
  align-items: center;
  width: 100%;
}
.toggle-btn { cursor: pointer; margin-right: 16px; }
.header-right { margin-left: auto; }
.user-info { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.username { font-size: 14px; }
</style>
