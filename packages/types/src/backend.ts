
export interface IBackendRes<T = any> {
  statusCode: number;
  message?: string;
  error?: string;
  data?: T;
}

// Pagination response matching backend ResultPaginationDTO
export interface ResultPaginationDTO<T = any> {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T;
}


export interface Role {
  id: number;
  name: string;
}
