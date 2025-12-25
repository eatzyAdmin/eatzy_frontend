import { useState } from "react";
import { useAuthStore } from "@repo/store";
import { LoginFormData } from "@repo/lib";
import { STORAGE_KEYS } from "@repo/ui";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLogin } = useAuthStore();

  const handleLogin = async (data: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    localStorage.removeItem("access_token");

    // Simulate API delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Get users from localStorage
      const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!usersStr) {
        setError("Hệ thống chưa được khởi tạo. Vui lòng tải lại trang.");
        setIsLoading(false);
        return false;
      }

      const users = JSON.parse(usersStr);

      // Find user by email and password
      const user = users.find((u: any) =>
        u.email === data.email &&
        u.password === data.password &&
        u.role === 'customer' // Only allow customer role to login to customer app
      );

      if (!user) {
        setError("Email hoặc mật khẩu không đúng.");
        setIsLoading(false);
        return false;
      }

      // Check if user is active
      if (user.status !== 'active') {
        setError("Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.");
        setIsLoading(false);
        return false;
      }

      // Get customer profile
      const customersStr = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (!customersStr) {
        setError("Không tìm thấy thông tin khách hàng.");
        setIsLoading(false);
        return false;
      }

      const customers = JSON.parse(customersStr);
      const customer = customers.find((c: any) => c.userId === user.id);

      if (!customer) {
        setError("Không tìm thấy hồ sơ khách hàng.");
        setIsLoading(false);
        return false;
      }

      // Create a fake access token (not secure, just for demo)
      const fakeToken = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));

      // Combine user and customer data
      const userData = {
        ...user,
        customerId: customer.id,
        totalOrders: customer.totalOrders,
        totalSpent: customer.totalSpent,
        favoriteRestaurantIds: customer.favoriteRestaurantIds,
      };

      // Save to auth store
      setLogin(fakeToken, userData);
      localStorage.setItem("access_token", fakeToken);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

      setIsLoading(false);
      return true;

    } catch (err: unknown) {
      console.error("Login error:", err);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      setIsLoading(false);
      return false;
    }
  };

  return {
    handleLogin,
    isLoading,
    error,
  };
};
