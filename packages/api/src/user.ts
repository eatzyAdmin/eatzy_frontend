import { http } from "./http";
import { IBackendRes, ResultPaginationDTO } from "../../types/src";

export const userApi = {
  getAllUsers: (params: any) => {
    return http.get<IBackendRes<ResultPaginationDTO<any[]>>>("/api/v1/users", { params }) as unknown as Promise<IBackendRes<ResultPaginationDTO<any[]>>>;
  },
  getUserById: (id: number) => {
    return http.get<IBackendRes<any>>(`/api/v1/users/${id}`) as unknown as Promise<IBackendRes<any>>;
  },
  createUser: (data: any) => {
    return http.post<IBackendRes<any>>("/api/v1/users", data) as unknown as Promise<IBackendRes<any>>;
  },
  updateUser: (data: any) => {
    return http.put<IBackendRes<any>>("/api/v1/users", data) as unknown as Promise<IBackendRes<any>>;
  },
  deleteUser: (id: number) => {
    return http.delete<IBackendRes<void>>(`/api/v1/users/${id}`) as unknown as Promise<IBackendRes<void>>;
  }
};
