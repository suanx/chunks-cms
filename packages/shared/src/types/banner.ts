export interface BannerInfo {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  linkType: number;
  targetType?: string;
  targetId?: number;
  position: string;
  sortOrder: number;
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  createdAt: string;
}

export interface CreateBannerParams {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  linkType?: number;
  targetType?: string;
  targetId?: number;
  position?: string;
  sortOrder?: number;
  isActive?: boolean;
  startTime?: string;
  endTime?: string;
}
