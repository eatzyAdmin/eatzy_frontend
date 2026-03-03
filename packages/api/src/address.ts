import { http } from "./http";
import { IBackendRes, ResultPaginationDTO, IAddress } from "../../types/src";

export const addressApi = {
  getMyAddresses: () => {
    return http.get<IBackendRes<IAddress[]>>("/api/v1/addresses/me") as unknown as Promise<IBackendRes<IAddress[]>>;
  },
  createAddress: (data: IAddress) => {
    return http.post<IBackendRes<IAddress>>("/api/v1/addresses/me", data) as unknown as Promise<IBackendRes<IAddress>>;
  },
  updateAddress: (data: IAddress) => {
    return http.put<IBackendRes<IAddress>>(`/api/v1/addresses/me/${data.id}`, data) as unknown as Promise<IBackendRes<IAddress>>;
  },
  deleteAddress: (id: number) => {
    return http.delete<IBackendRes<void>>(`/api/v1/addresses/me/${id}`) as unknown as Promise<IBackendRes<void>>;
  },
};
