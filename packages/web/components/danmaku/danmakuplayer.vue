<template>
  <div class="danmaku-container" ref="containerRef">
    <div class="danmaku-canvas" v-show="enabled">
      <div v-for="(d, i) in displayDanmakus" :key="i" class="danmaku-item"
        :class="[d.mode]" :style="{ color: d.color, top: d.y + 'px', animationDuration: d.speed + 's' }">
        {{ d.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DanmakuData { content: string; timePoint: number; color?: string; mode?: string; }

const props = defineProps<{ danmakus: DanmakuData[]; currentTime: number; enabled?: boolean }>();
const containerRef = ref<HTMLElement>();
const displayDanmakus = ref<any[]>([]);
const enabled = computed(() => props.enabled !== false);

watch(() => props.currentTime, (time) => {
  const ms = time * 1000;
  const nearby = props.danmakus.filter(d => Math.abs(d.timePoint - ms) < 1000);
  nearby.forEach(d => {
    if (!displayDanmakus.value.find(x => x.content === d.content && Math.abs(x.timePoint - d.timePoint) < 500)) {
      displayDanmakus.value.push({
        ...d,
        y: Math.random() * 200 + 20,
        speed: 5 + Math.random() * 3,
        timePoint: d.timePoint,
      });
    }
  });
  // 清理过期弹幕
  displayDanmakus.value = displayDanmakus.value.filter(d => {
    const elapsed = (ms - d.timePoint) / 1000;
    return elapsed < d.speed + 2;
  });
});
</script>

<style scoped lang="scss">
.danmaku-container { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; overflow: hidden; }
.danmaku-item {
  position: absolute; left: 100%; white-space: nowrap; font-size: 22px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
  animation: danmaku-scroll linear forwards;
  &.top { animation: none; left: 50%; transform: translateX(-50%); }
}
@keyframes danmaku-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100vw - 100%)); }
}
</style>
