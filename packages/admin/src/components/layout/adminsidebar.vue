<template>
  <div class="sidebar-inner">
    <div class="logo" :class="{ collapsed }">{{ collapsed ? 'CY' : '🎬 淳渔 CMS' }}</div>
    <el-menu :default-active="activeMenu" :collapse="collapsed" background-color="#304156" text-color="#bfcbd9"
      active-text-color="#409eff" router class="sidebar-menu">
      <template v-for="route in menuRoutes" :key="route.path">
        <el-sub-menu v-if="route.children && route.children.length > 1" :index="'/' + route.path">
          <template #title>
            <el-icon><component :is="route.meta?.icon" /></el-icon>
            <span>{{ route.meta?.title }}</span>
          </template>
          <el-menu-item v-for="child in route.children.filter((c: any) => !c.meta?.hidden)" :key="child.path"
            :index="'/' + route.path + '/' + child.path">
            {{ child.meta?.title }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="route.children?.[0] ? '/' + route.path + '/' + route.children[0].path : '/' + route.path">
          <el-icon><component :is="route.meta?.icon" /></el-icon>
          <span>{{ route.children?.[0]?.meta?.title || route.meta?.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { routes } from '@/router/routes';

defineProps<{ collapsed: boolean }>();

const route = useRoute();
const activeMenu = computed(() => route.path);

const menuRoutes = computed(() => {
  const main = routes.find(r => r.path === '/');
  return (main?.children || []).filter((r: any) => !r.meta?.hidden);
});
</script>

<style scoped lang="scss">
.sidebar-inner { height: 100%; }
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: #263445;
  &.collapsed { font-size: 14px; }
}
.sidebar-menu { border-right: none; }
</style>
