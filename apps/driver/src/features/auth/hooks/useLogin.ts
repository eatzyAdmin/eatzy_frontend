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

    // Clear old token before login
    localStorage.removeItem("access_token");

    try {
      // Get users from localStorage
      const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!usersStr) {
        setError("Không tìm thấy dữ liệu người dùng");
        setIsLoading(false);
        return false;
      }

      const users = JSON.parse(usersStr);

      // Find user by email and password
      const user = users.find(
        (u: any) => u.email === data.email && u.password === data.password
      );

      if (!user) {
        setError("Email hoặc mật khẩu không đúng");
        setIsLoading(false);
        return false;
      }

      // Check if user is a driver
      if (user.role !== 'driver') {
        setError("Tài khoản này không phải là tài khoản tài xế");
        setIsLoading(false);
        return false;
      }

      // Get driver profile
      const driversStr = localStorage.getItem(STORAGE_KEYS.DRIVERS);
      if (!driversStr) {
        setError("Không tìm thấy thông tin tài xế");
        setIsLoading(false);
        return false;
      }

      const drivers = JSON.parse(driversStr);
      const driverProfile = drivers.find((d: any) => d.userId === user.id);

      if (!driverProfile) {
        setError("Không tìm thấy hồ sơ tài xế");
        setIsLoading(false);
        return false;
      }

      // Check driver status
      if (driverProfile.status === 'disabled') {
        setError("Tài khoản tài xế đã bị vô hiệu hóa");
        setIsLoading(false);
        return false;
      }

      // Generate mock token
      const mockToken = `driver_token_${user.id}_${Date.now()}`;

      // Save login state
      setLogin(mockToken, user);
      localStorage.setItem("access_token", mockToken);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

      // Set cookie for Driver middleware authentication
      document.cookie = "driver_auth=1; path=/; max-age=86400"; // 1 day expiry

      console.log('✅ Driver login successful:', {
        user: user.email,
        driver: driverProfile.fullName,
        driverId: driverProfile.id
      });

      // Keep loading during redirect
      return true;

    } catch (err: unknown) {
      console.error('Driver login error:', err);
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
