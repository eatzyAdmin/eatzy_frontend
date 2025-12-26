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

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get users from localStorage
      const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!usersStr) {
        setError("Hệ thống chưa được khởi tạo. Vui lòng liên hệ admin.");
        setIsLoading(false);
        return false;
      }

      const users = JSON.parse(usersStr);

      // Find user by email and password
      const user = users.find((u: any) =>
        u.email === data.email && u.password === data.password
      );

      if (!user) {
        setError("Email hoặc mật khẩu không chính xác");
        setIsLoading(false);
        return false;
      }

      // Check if user is a restaurant
      if (user.role !== 'restaurant') {
        setError("Tài khoản này không có quyền truy cập vào hệ thống quản lý quán ăn");
        setIsLoading(false);
        return false;
      }

      // Check if account is active
      if (user.status !== 'active') {
        setError("Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ admin.");
        setIsLoading(false);
        return false;
      }

      // Create mock access token
      const mockToken = `mock_token_${user.id}_${Date.now()}`;

      // Save current user to localStorage
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem("access_token", mockToken);

      // Update auth store
      setLogin(mockToken, user);

      console.log('✅ Restaurant login successful:', user.email);
      setIsLoading(false);
      return true;

    } catch (err: unknown) {
      console.error('Login error:', err);
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
