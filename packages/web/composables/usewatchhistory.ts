export const useWatchHistory = () => {
  const { api } = useApi();

  const addToHistory = async (videoId: number, currentPosition: number, duration: number, lastPlayUrl?: string) => {
    if (!process.client) return;
    try {
      await api.post(`/users/watch-history/${videoId}`, { currentPosition, duration, lastPlayUrl });
    } catch (e) { console.error('[WatchHistory] 添加观看历史失败:', e); }
  };

  const updateProgress = async (videoId: number, currentPosition: number, duration: number, lastPlayUrl?: string) => {
    if (!process.client) return;
    try {
      await api.patch(`/users/watch-progress/${videoId}`, { currentPosition, duration, lastPlayUrl });
    } catch (e) { console.error('[WatchHistory] 更新观看进度失败:', e); }
  };

  const getResumeInfo = async (videoId: number) => {
    try {
      const history = await api.get('/users/watch-history/resume');
      const item = history?.find((h: any) => h.videoId === videoId);
      return item ? { position: item.currentPosition, duration: item.duration } : null;
    } catch (e) { console.error('[WatchHistory] 获取续播信息失败:', e); return null; }
  };

  const getHistory = async (page = 1, pageSize = 20) => {
    try {
      return await api.get('/users/watch-history', { page, pageSize });
    } catch (e) { console.error('[WatchHistory] 获取观看历史失败:', e); return { list: [], total: 0 }; }
  };

  return { addToHistory, updateProgress, getResumeInfo, getHistory };
};
