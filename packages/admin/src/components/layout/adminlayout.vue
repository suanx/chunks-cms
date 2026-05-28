<template>
  <el-container class="admin-layout">
    <el-aside :width="collapsed ? '64px' : '220px'" class="sidebar">
      <AdminSidebar :collapsed="collapsed" />
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <AdminHeader :collapsed="collapsed" @toggle="collapsed = !collapsed" />
      </el-header>
      <el-main class="admin-main">
        <AdminBreadcrumb />
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import AdminSidebar from './AdminSidebar.vue';
import AdminHeader from './AdminHeader.vue';
import AdminBreadcrumb from './AdminBreadcrumb.vue';

const collapsed = ref(false);
</script>

<style scoped lang="scss">
.admin-layout { height: 100vh; }
.sidebar {
  background: #304156;
  transition: width 0.3s;
  overflow: hidden;
}
.admin-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.admin-main {
  background: #f0f2f5;
  padding: 20px;
}
</style>
