<template>
  <el-popover trigger="click" placement="bottom" :width="360">
    <template #reference>
      <div class="notification-bell">
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99">
          <el-icon :size="20"><Bell /></el-icon>
        </el-badge>
      </div>
    </template>
    <div class="notification-panel">
      <div class="panel-header">
        <h4>通知</h4>
        <el-button text size="small" @click="markAllRead">全部已读</el-button>
      </div>
      <div class="notification-list">
        <div v-for="item in notifications" :key="item.id" class="notification-item" :class="{ unread: !item.isRead }" @click="readNotification(item)">
          <div class="noti-icon">{{ typeIcon(item.type) }}</div>
          <div class="noti-content">
            <h5>{{ item.title }}</h5>
            <p>{{ item.content }}</p>
            <span class="noti-time">{{ formatTimeAgo(item.createdAt) }}</span>
          </div>
        </div>
        <el-empty v-if="!notifications.length" description="暂无通知" :image-size="60" />
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue';

const { api } = useApi();
const notifications = ref<any[]>([]);
const unreadCount = ref(0);

const typeIcon = (type: string) => {
  const icons: Record<string, string> = { system: '📢', comment_reply: '💬', new_content: '🎬', favorite: '⭐' };
  return icons[type] || '🔔';
};

const formatTimeAgo = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  return `${Math.floor(diff / 86400000)}天前`;
};

const loadNotifications = async () => {
  try {
    const data = await api.get('/notifications', { pageSize: 20 });
    notifications.value = data?.list || [];
    unreadCount.value = data?.unreadCount || 0;
  } catch (e) { console.error('loadNotifications failed:', e); }
};

const readNotification = async (item: any) => {
  if (!item.isRead) {
    await api.patch(`/notifications/${item.id}/read`);
    item.isRead = true;
    unreadCount.value = Math.max(0, unreadCount.value - 1);
  }
};

const markAllRead = async () => {
  await api.patch('/notifications/read-all');
  notifications.value.forEach(n => n.isRead = true);
  unreadCount.value = 0;
};

let timer: any;
onMounted(() => {
  loadNotifications();
  timer = setInterval(loadNotifications, 60000);
});
onUnmounted(() => clearInterval(timer));
</script>

<style scoped lang="scss">
.notification-bell { cursor: pointer; padding: 4px; }
.notification-panel { }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; h4 { margin: 0; } }
.notification-list { max-height: 400px; overflow-y: auto; }
.notification-item {
  display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border-color-lighter);
  cursor: pointer; &.unread { background: rgba(64,158,255,0.05); }
  &:hover { background: rgba(0,0,0,0.02); }
}
.noti-icon { font-size: 20px; padding-top: 2px; }
.noti-content { flex: 1; h5 { font-size: 13px; margin-bottom: 2px; } p { font-size: 12px; color: var(--text-color-secondary); margin-bottom: 4px; } }
.noti-time { font-size: 11px; color: var(--text-color-placeholder); }
</style>
