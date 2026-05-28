/** 默认分页配置 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/** 文件上传限制 */
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

/** 缓存 TTL (秒) */
export const CACHE_TTL_SHORT = 60; // 1 分钟
export const CACHE_TTL_MEDIUM = 300; // 5 分钟
export const CACHE_TTL_LONG = 3600; // 1 小时

/** Redis Key 前缀 */
export const REDIS_KEY_PREFIX = 'chunyu:';

/** 评分范围 */
export const RATING_MIN = 1;
export const RATING_MAX = 10;
