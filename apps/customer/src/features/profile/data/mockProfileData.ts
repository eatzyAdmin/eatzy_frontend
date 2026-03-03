import { ICustomerProfileDisplay } from "@repo/types";

export const mockCustomerProfile: ICustomerProfileDisplay = {
  name: "No data",
  phone: "No data",
  email: "No data",
  profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
  membershipTier: "Gold Member",
};
export const mockAddresses = [
  { id: 1, label: "Nhà riêng", addressLine: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh" },
  { id: 2, label: "Công ty", addressLine: "456 Đại lộ Nguyễn Huệ, Quận 3, TP. Hồ Chí Minh" },
  { id: 3, label: "Nhà bạn gái", addressLine: "789 Đường Võ Văn Kiệt, Quận 5, TP. Hồ Chí Minh" }
];
