import { http } from "./http";
import { IBackendRes, ResultPaginationDTO, ResCustomerProfileDTO } from "../../types/src";

export const customerApi = {
  getAllCustomers: (params: any) => {
    return http.get<IBackendRes<ResultPaginationDTO<ResCustomerProfileDTO[]>>>("/api/v1/customer-profiles", { params }) as unknown as Promise<IBackendRes<ResultPaginationDTO<ResCustomerProfileDTO[]>>>;
  },
  getCustomerById: (id: number) => {
    return http.get<IBackendRes<ResCustomerProfileDTO>>(`/api/v1/customer-profiles/${id}`) as unknown as Promise<IBackendRes<ResCustomerProfileDTO>>;
  },
  getCustomerByUserId: (userId: number) => {
    return http.get<IBackendRes<ResCustomerProfileDTO>>(`/api/v1/customer-profiles/user/${userId}`) as unknown as Promise<IBackendRes<ResCustomerProfileDTO>>;
  },
  createCustomer: (data: any) => {
    return http.post<IBackendRes<ResCustomerProfileDTO>>("/api/v1/customer-profiles", data) as unknown as Promise<IBackendRes<ResCustomerProfileDTO>>;
  },
  updateCustomer: (data: any) => {
    return http.put<IBackendRes<ResCustomerProfileDTO>>("/api/v1/customer-profiles", data) as unknown as Promise<IBackendRes<ResCustomerProfileDTO>>;
  },
  deleteCustomer: (id: number) => {
    return http.delete<IBackendRes<void>>(`/api/v1/customer-profiles/${id}`) as unknown as Promise<IBackendRes<void>>;
  }
};
