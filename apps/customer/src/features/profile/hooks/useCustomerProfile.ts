import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getMyCustomerProfile, updateCustomerProfile } from "../api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ResCustomerProfileDTO } from "@repo/types";
import { sileo } from "@/components/DynamicIslandToast";

export const useCustomerProfile = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<ResCustomerProfileDTO | undefined>({
    queryKey: ["customer", "profile", "me"],
    queryFn: async () => {
      const res = await getMyCustomerProfile();
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => updateCustomerProfile(data),
    onSuccess: () => {
      sileo.success({
        actionType: "profile_update_success",
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân của bạn đã được lưu lại.",
        avatarUrl: data?.user?.avatar
      });
      queryClient.invalidateQueries({ queryKey: ["customer", "profile", "me"] });
    },
    onError: (err: any) => {
      sileo.error({
        actionType: "profile_update_error",
        title: "Cập nhật thất bại",
        description: err.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật thông tin."
      });
    }
  });

  return {
    profile: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    refresh: useCallback(async () => {
      await Promise.all([
        queryClient.resetQueries({ queryKey: ["customer", "profile", "me"] }),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
    }, [queryClient]),
  };
};
