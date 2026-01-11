export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  profilePhoto: string;
  membershipTier: string;
  totalOrders: number;
  reviewsCount: number;
  rewardPoints: number;
}

export const mockCustomerProfile: CustomerProfile = {
  id: "user_123",
  name: "Trần Minh Hiếu",
  phone: "0912 345 678",
  email: "hieu.tran@example.com",
  profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
  membershipTier: "Gold Member",
  totalOrders: 42,
  reviewsCount: 15,
  rewardPoints: 850,
};
