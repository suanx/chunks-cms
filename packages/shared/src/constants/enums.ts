/** 用户状态 */
export enum UserStatus {
  DISABLED = 0,
  ACTIVE = 1,
  DELETED = -1,
}

/** 用户角色 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  MEMBER = 'member',
}

/** 视频审核状态 */
export enum VideoStatus {
  PENDING = 0,
  PUBLISHED = 1,
  REJECTED = 2,
  OFFLINE = 3,
}

/** 视频发布状态 */
export enum PublishStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  SCHEDULED = 2,
}

/** 影视剧类型 */
export enum MovieType {
  MOVIE = 1,
  TV_SERIES = 2,
  VARIETY = 3,
  ANIME = 4,
  DOCUMENTARY = 5,
}

/** 影视剧状态 */
export enum MovieStatus {
  PENDING = 0,
  ONLINE = 1,
  REJECTED = 2,
  OFFLINE = 3,
}

/** 分类类型 */
export enum CategoryType {
  VIDEO = 1,
  MOVIE = 2,
  COMMON = 3,
}

/** 评论状态 */
export enum CommentStatus {
  PENDING = 0,
  ACTIVE = 1,
  DELETED = -1,
}

/** 文件类型 */
export enum FileType {
  IMAGE = 1,
  VIDEO = 2,
  DOCUMENT = 3,
}

/** 链接类型 */
export enum LinkType {
  INTERNAL = 1,
  EXTERNAL = 2,
}
