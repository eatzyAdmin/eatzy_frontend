import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IAddress } from "@repo/types";
import { sileo } from "@/components/DynamicIslandToast";
import { addressApi } from "@repo/api";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useCustomerAddresses = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["customer", "addresses", "me"],
    queryFn: async () => {
      const res = await addressApi.getMyAddresses();
      return res.data || [];
    },
    enabled: isAuthenticated,
  });

  const createAddressMutation = useMutation({
    mutationFn: (newAddress: IAddress) => addressApi.createAddress(newAddress),
    onSuccess: () => {
      sileo.success({
        title: "Thêm địa chỉ thành công",
        description: "Địa chỉ mới của bạn đã được lưu lại."
      });
      queryClient.invalidateQueries({ queryKey: ["customer", "addresses", "me"] });
    }
  });

  const updateAddressMutation = useMutation({
    mutationFn: (updatedAddress: IAddress) => addressApi.updateAddress(updatedAddress),
    onSuccess: () => {
      sileo.success({
        title: "Cập nhật thành công",
        description: "Thông tin địa chỉ đã được thay đổi."
      });
      queryClient.invalidateQueries({ queryKey: ["customer", "addresses", "me"] });
    }
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: number) => addressApi.deleteAddress(id),
    onSuccess: () => {
      sileo.success({
        title: "Đã xóa địa chỉ",
        description: "Địa chỉ đã được gỡ khỏi danh sách của bạn."
      });
      queryClient.invalidateQueries({ queryKey: ["customer", "addresses", "me"] });
    }
  });

  return {
    addresses: data || [],
    isLoading,
    isError,
    error,
    refetch,
    createAddress: createAddressMutation.mutate,
    isCreating: createAddressMutation.isPending,
    updateAddress: updateAddressMutation.mutate,
    isUpdating: updateAddressMutation.isPending,
    deleteAddress: deleteAddressMutation.mutate,
    isDeleting: deleteAddressMutation.isPending,
  };
};
