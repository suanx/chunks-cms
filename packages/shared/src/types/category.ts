export interface CategoryInfo {
  id: number;
  name: string;
  slug?: string;
  parentId: number;
  icon?: string;
  coverUrl?: string;
  description?: string;
  type: number;
  sortOrder: number;
  isVisible: boolean;
  videoCount: number;
  children?: CategoryInfo[];
  createdAt: string;
}

export interface CreateCategoryParams {
  name: string;
  slug?: string;
  parentId?: number;
  icon?: string;
  coverUrl?: string;
  description?: string;
  type: number;
  sortOrder?: number;
  isVisible?: boolean;
}
