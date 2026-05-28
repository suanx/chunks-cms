<template>
  <el-popover trigger="click" placement="top" :width="260">
    <template #reference>
      <el-button text size="small"><el-icon><Share /></el-icon> 分享</el-button>
    </template>
    <div class="share-card">
      <h4>分享到</h4>
      <div class="share-options">
        <div class="share-item" @click="shareToWechat">
          <div class="share-icon wechat">💬</div>
          <span>微信</span>
        </div>
        <div class="share-item" @click="shareToQQ">
          <div class="share-icon qq">🐧</div>
          <span>QQ</span>
        </div>
        <div class="share-item" @click="shareToWeibo">
          <div class="share-icon weibo">📝</div>
          <span>微博</span>
        </div>
        <div class="share-item" @click="copyLink">
          <div class="share-icon link">🔗</div>
          <span>复制链接</span>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { Share } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const props = defineProps<{ title: string; url?: string }>();
const shareUrl = computed(() => props.url || (process.client ? window.location.href : ''));

const shareToWechat = () => { ElMessage.info('请截图分享到微信'); };
const shareToQQ = () => {
  window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl.value)}&title=${encodeURIComponent(props.title)}`);
};
const shareToWeibo = () => {
  window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl.value)}&title=${encodeURIComponent(props.title)}`);
};
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    ElMessage.success('链接已复制');
  } catch { ElMessage.error('复制失败'); }
};
</script>

<style scoped lang="scss">
.share-card { text-align: center; }
h4 { margin-bottom: 12px; font-size: 14px; }
.share-options { display: flex; justify-content: space-around; }
.share-item { cursor: pointer; text-align: center; &:hover .share-icon { transform: scale(1.1); } }
.share-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px; font-size: 20px; transition: transform 0.2s; background: #f5f7fa; }
.share-item span { font-size: 12px; color: var(--text-color-secondary); }
</style>
