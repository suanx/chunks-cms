export const VIDEO_STATUS: Record<number, { label: string; type: string }> = {
  0: { label: '待审核', type: 'warning' },
  1: { label: '已发布', type: 'success' },
  2: { label: '审核不通过', type: 'danger' },
  3: { label: '已下架', type: 'info' },
};

export const MOVIE_TYPE: Record<number, string> = {
  1: '电影', 2: '电视剧', 3: '综艺', 4: '动漫', 5: '纪录片',
};

export const MOVIE_STATUS: Record<number, { label: string; type: string }> = {
  0: { label: '待审核', type: 'warning' },
  1: { label: '已上线', type: 'success' },
  2: { label: '审核不通过', type: 'danger' },
  3: { label: '已下架', type: 'info' },
};

export const USER_STATUS: Record<number, { label: string; type: string }> = {
  0: { label: '禁用', type: 'danger' },
  1: { label: '正常', type: 'success' },
  [-1 as number]: { label: '已删除', type: 'info' },
};
