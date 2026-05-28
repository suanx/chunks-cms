export interface ApiResult<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
