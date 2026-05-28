export interface VideoInfo {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  coverUrl?: string;
  videoUrl: string;
  duration: number;
  fileSize: number;
  resolution?: string;
  status: number;
  publishStatus: number;
  sortOrder: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  source?: string;
  sourceUrl?: string;
  uploaderId?: number;
  categories?: CategoryInfo[];
  tags?: TagInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateVideoParams {
  title: string;
  description?: string;
  coverUrl?: string;
  videoUrl: string;
  duration?: number;
  fileSize?: number;
  resolution?: string;
  categoryIds?: number[];
  tagIds?: number[];
  source?: string;
  sourceUrl?: string;
  sortOrder?: number;
}

export interface UpdateVideoParams extends Partial<CreateVideoParams> {
  status?: number;
  publishStatus?: number;
}

export interface QueryVideoParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
  status?: number;
  publishStatus?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
