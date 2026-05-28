/** 分页请求参数 */
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

/** 分页响应 */
export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 统一 API 响应体 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/** 排序方向 */
export type SortDirection = 'ASC' | 'DESC';

/** 排序参数 */
export interface SortQuery {
  sortBy?: string;
  sortOrder?: SortDirection;
}
