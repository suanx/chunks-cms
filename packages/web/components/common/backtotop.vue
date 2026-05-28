<template>
  <transition name="fade">
    <div v-show="visible" class="back-to-top" @click="scrollToTop">
      <el-icon :size="20"><ArrowUp /></el-icon>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ArrowUp } from '@element-plus/icons-vue';

const visible = ref(false);
const handleScroll = () => { visible.value = window.scrollY > 300; };
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary-color);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-base);
  z-index: 99;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
