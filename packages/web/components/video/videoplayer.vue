<template>
  <div class="video-player-wrapper">
    <div class="video-player" @mousemove="showControls = true" @mouseleave="showControls = false">
      <video ref="videoRef" :src="src" preload="metadata" class="player-video"
        @timeupdate="onTimeUpdate" @loadedmetadata="onLoaded" @play="onPlay" @pause="onPause">
        您的浏览器不支持视频播放
      </video>
      <DanmakuPlayer v-if="danmakuEnabled" :danmakus="danmakus" :current-time="currentTime" />
      <div class="player-controls" :class="{ visible: showControls || paused }">
        <div class="progress-bar" @click="seek">
          <div class="progress" :style="{ width: progress + '%' }"></div>
          <div class="buffered" :style="{ width: buffered + '%' }"></div>
        </div>
        <div class="controls-row">
          <div class="controls-left">
            <el-button text @click="togglePlay" style="color:#fff">{{ paused ? '▶' : '⏸' }}</el-button>
            <span class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
          </div>
          <div class="controls-right">
            <DanmakuSender v-if="videoId" :videoId="videoId" :currentTime="currentTime" />
            <el-button text size="small" style="color:#fff" @click="danmakuEnabled = !danmakuEnabled">
              {{ danmakuEnabled ? '弹' : '弹幕关' }}
            </el-button>
            <el-button text size="small" style="color:#fff" @click="toggleFullscreen">⛶</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 续播提示 -->
    <div v-if="resumePosition > 0 && !resumed" class="resume-tip">
      <span>上次播放到 {{ formatTime(resumePosition) }}</span>
      <el-button type="primary" size="small" @click="continuePlay">继续播放</el-button>
      <el-button size="small" @click="startFromBeginning">从头播放</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import DanmakuPlayer from '../danmaku/DanmakuPlayer.vue';
import DanmakuSender from '../danmaku/DanmakuSender.vue';

const props = defineProps<{
  src: string;
  videoId?: number;
  danmakus?: any[];
}>();

const videoRef = ref<HTMLVideoElement>();
const currentTime = ref(0);
const duration = ref(0);
const paused = ref(true);
const showControls = ref(false);
const progress = ref(0);
const buffered = ref(0);
const danmakuEnabled = ref(true);
const resumePosition = ref(0);
const resumed = ref(false);
const saveTimer = ref<any>();

const formatTime = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}` : `${m}:${String(sec).padStart(2,'0')}`;
};

const togglePlay = () => { videoRef.value?.paused ? videoRef.value?.play() : videoRef.value?.pause(); };
const onPlay = () => { paused.value = false; };
const onPause = () => { paused.value = true; };

const onTimeUpdate = () => {
  if (!videoRef.value) return;
  currentTime.value = videoRef.value.currentTime;
  progress.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
  // 自动保存进度 (每30秒)
  if (props.videoId && Math.floor(currentTime.value) % 30 === 0 && currentTime.value > 0) {
    saveProgress();
  }
};

const onLoaded = () => {
  if (!videoRef.value) return;
  duration.value = videoRef.value.duration;
  if (buffered.value > 0) buffered.value = (videoRef.value.buffered.end(0) / duration.value) * 100;
};

const seek = (e: MouseEvent) => {
  if (!videoRef.value) return;
  const rect = (e.target as HTMLElement).getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  videoRef.value.currentTime = ratio * duration.value;
};

const toggleFullscreen = () => {
  const el = videoRef.value?.parentElement;
  if (document.fullscreenElement) document.exitFullscreen();
  else el?.requestFullscreen();
};

const saveProgress = async () => {
  if (props.videoId) {
    const { updateProgress } = useWatchHistory();
    await updateProgress(props.videoId, currentTime.value, duration.value);
  }
};

const continuePlay = () => {
  if (videoRef.value && resumePosition.value > 0) {
    videoRef.value.currentTime = resumePosition.value;
    videoRef.value.play();
  }
  resumed.value = true;
};

const startFromBeginning = () => { resumed.value = true; };

onMounted(async () => {
  if (props.videoId) {
    const { getResumeInfo } = useWatchHistory();
    const info = await getResumeInfo(props.videoId);
    if (info && info.position > 5) resumePosition.value = info.position;
  }
});

onUnmounted(() => { saveProgress(); });
</script>

<style scoped lang="scss">
.video-player-wrapper { position: relative; }
.video-player {
  position: relative; width: 100%; background: #000; border-radius: 8px; overflow: hidden;
}
.player-video { width: 100%; display: block; max-height: 600px; }
.player-controls {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  padding: 10px 16px; transition: opacity 0.3s; opacity: 0;
  &.visible { opacity: 1; }
}
.progress-bar {
  height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; cursor: pointer;
  position: relative; margin-bottom: 8px;
  .progress { height: 100%; background: var(--primary-color); border-radius: 2px; position: relative;
    &::after { content: ''; position: absolute; right: -6px; top: -4px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary-color); }
  }
  .buffered { position: absolute; top: 0; height: 100%; background: rgba(255,255,255,0.3); border-radius: 2px; }
}
.controls-row { display: flex; justify-content: space-between; align-items: center; }
.controls-left, .controls-right { display: flex; align-items: center; gap: 8px; }
.time { color: #fff; font-size: 13px; }
.resume-tip {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  background: rgba(0,0,0,0.05); border-radius: 8px; margin-top: 12px;
  font-size: 14px; color: var(--text-color-regular);
}
</style>
