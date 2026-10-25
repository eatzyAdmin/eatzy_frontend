import type { IUserLogin, IResLoginDTO } from "@repo/types";

export const MOCK_AUTH_USERS: Record<string, IUserLogin> = {
  customer: {
    id: 1,
    name: "Nguyễn Văn Nam",
    email: "customer@eatzy.vn",
    phone: "0901234567",
    role: {
      id: 1,
      name: "ROLE_CUSTOMER",
    },
  },
  restaurant: {
    id: 2,
    name: "Trần Thị Mai (Chủ Quán)",
    email: "restaurant@eatzy.vn",
    phone: "0912345678",
    role: {
      id: 2,
      name: "ROLE_RESTAURANT_OWNER",
    },
  },
  driver: {
    id: 3,
    name: "Lê Hoàng Phúc (Tài Xế)",
    email: "driver@eatzy.vn",
    phone: "0923456789",
    role: {
      id: 3,
      name: "ROLE_DRIVER",
    },
  },
  superAdmin: {
    id: 4,
    name: "Quản Trị Viên Hệ Thống",
    email: "superadmin@eatzy.vn",
    phone: "0934567890",
    role: {
      id: 4,
      name: "ROLE_SUPER_ADMIN",
    },
  },
};

export const MOCK_ACCESS_TOKENS: Record<string, string> = {
  customer: "mock-jwt-customer-token-eatzy-2026",
  restaurant: "mock-jwt-restaurant-token-eatzy-2026",
  driver: "mock-jwt-driver-token-eatzy-2026",
  superAdmin: "mock-jwt-superadmin-token-eatzy-2026",
};

/**
 * Helper to get mock user and token by role
 */
export function getMockAuthByRole(role: "customer" | "restaurant" | "driver" | "superAdmin"): IResLoginDTO {
  return {
    access_token: MOCK_ACCESS_TOKENS[role] || (MOCK_ACCESS_TOKENS.customer as string),
    user: MOCK_AUTH_USERS[role] || (MOCK_AUTH_USERS.customer as IUserLogin),
  };
}

/**
 * Helper to simulate login credentials
 */
export function mockAuthenticate(username?: string, _password?: string): IResLoginDTO {
  const normalized = (username || "").toLowerCase();
  if (normalized.includes("rest") || normalized.includes("owner") || normalized.includes("quan")) {
    return getMockAuthByRole("restaurant");
  }
  if (normalized.includes("driver") || normalized.includes("ship") || normalized.includes("tai")) {
    return getMockAuthByRole("driver");
  }
  if (normalized.includes("admin") || normalized.includes("super")) {
    return getMockAuthByRole("superAdmin");
  }
  return getMockAuthByRole("customer");
}
