<template>
  <header class="app-header">
    <div class="header-inner container">
      <div class="header-left">
        <NuxtLink to="/" class="logo">🎬 淳渔</NuxtLink>
        <nav class="nav-menu">
          <NuxtLink to="/" class="nav-item">{{ t('nav.home') }}</NuxtLink>
          <NuxtLink to="/video" class="nav-item">{{ t('nav.video') }}</NuxtLink>
          <NuxtLink to="/movie" class="nav-item">{{ t('nav.movie') }}</NuxtLink>
        </nav>
      </div>
      <div class="header-right">
        <div class="search-box">
          <el-input v-model="keyword" :placeholder="t('search.placeholder')" clearable @keyup.enter="handleSearch"
            prefix-icon="Search" size="default" style="width: 300px" />
        </div>
        <NotificationBell v-if="isLoggedIn" />
        <el-button text @click="toggleTheme">
          <el-icon :size="18">{{ isDark ? '☀️' : '🌙' }}</el-icon>
        </el-button>
        <el-dropdown trigger="click" size="small">
          <el-button text size="small">{{ locale === 'zh-CN' ? '中文' : 'EN' }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="setLocale('zh-CN')">中文</el-dropdown-item>
              <el-dropdown-item @click="setLocale('en')">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <template v-if="isLoggedIn">
          <el-dropdown trigger="click">
            <span class="user-info">
              <el-avatar :src="user?.avatar" :size="32">{{ user?.nickname?.charAt(0) || 'U' }}</el-avatar>
              <span class="username">{{ user?.nickname || user?.username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="navigateTo('/user/center')">{{ t('user.center') }}</el-dropdown-item>
                <el-dropdown-item @click="navigateTo('/user/favorites')">{{ t('user.favorites') }}</el-dropdown-item>
                <el-dropdown-item @click="navigateTo('/user/history')">{{ t('user.history') }}</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">{{ t('user.logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="primary" @click="showLogin = true">{{ t('user.login') }}</el-button>
        </template>
      </div>
    </div>
  </header>
  <LoginDialog v-model="showLogin" />
</template>

<script setup lang="ts">
import NotificationBell from '../notification/NotificationBell.vue';
const { isDark, toggleTheme } = useTheme();
const { locale, setLocale, t, initLocale } = useI18n();

const keyword = ref('');
const showLogin = ref(false);
const { isLoggedIn, user } = useAuth();

onMounted(() => {
  initTheme();
  initLocale();
});

const handleSearch = () => {
  if (keyword.value.trim()) {
    navigateTo(`/search?keyword=${encodeURIComponent(keyword.value.trim())}`);
  }
};

const handleLogout = () => {
  const { logout } = useAuth();
  logout();
};
</script>

<style scoped lang="scss">
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: #fff;
  box-shadow: var(--shadow-light);
  z-index: 100;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
}
.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
}
.nav-menu {
  display: flex;
  gap: 24px;
}
.nav-item {
  font-size: 15px;
  color: var(--text-color-regular);
  transition: color 0.2s;
  &:hover, &.router-link-exact-active {
    color: var(--primary-color);
  }
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.username {
  font-size: 14px;
  color: var(--text-color-regular);
}
</style>
