import { customerApi, addressApi } from "@repo/api";

export const getMyCustomerProfile = customerApi.getMyProfile;
export const updateCustomerProfile = customerApi.updateMyProfile;
export { addressApi };
