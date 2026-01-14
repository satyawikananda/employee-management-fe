interface BaseApiOptions {
  baseURL?: string;
}

type PaginatedFilters = {
  limit?: number | string;
  page?: number | string;
  search?: string;
  sort?: string;
};

type BaseApiResult<T> = {
  data: T;
  message: string;
  status: number;
};

type BasePaginatedApiResult<T> = {
  message: string;
  status: number;
  data: T;
  pagination: {
    total: number;
    nextPage: number;
    limit: number;
    currentPage: number;
  };
};
