import { ICustomerProfileDisplay } from "@repo/types";

export const mockCustomerProfile: ICustomerProfileDisplay = {
  name: "No data",
  phone: "No data",
  email: "No data",
  profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
  membershipTier: "Gold Member",
};
export const mockAddresses = [
  { id: 1, label: "Home", address_line: "123 Le Loi Street, District 1, Ho Chi Minh City" },
  { id: 2, label: "Office", address_line: "456 Nguyen Hue Blvd, District 3, Ho Chi Minh City" },
  { id: 3, label: "Friend's House", address_line: "789 Vo Van Kiet Street, District 5, Ho Chi Minh City" }
];
