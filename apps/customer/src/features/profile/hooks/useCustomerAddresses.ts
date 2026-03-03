import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IAddress } from "@repo/types";
import { sileo } from "@/components/DynamicIslandToast";
import { mockAddresses } from "../data/mockProfileData";

export const useCustomerAddresses = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["customer", "addresses", "me"],
    queryFn: async () => {
      // Temporarily use mock data with artificial delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockAddresses as any[];
    },
  });

  const createAddressMutation = useMutation({
    mutationFn: async (newAddress: IAddress) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { ...newAddress, id: Math.random() };
    },
    onSuccess: () => {
      sileo.success({
        title: "Thêm địa chỉ thành công",
        description: "Địa chỉ mới của bạn đã được lưu lại."
      });
      queryClient.invalidateQueries({ queryKey: ["customer", "addresses", "me"] });
    }
  });

  const updateAddressMutation = useMutation({
    mutationFn: async (updatedAddress: IAddress) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return updatedAddress;
    },
    onSuccess: () => {
      sileo.success({
        title: "Cập nhật thành công",
        description: "Thông tin địa chỉ đã được thay đổi."
      });
      queryClient.invalidateQueries({ queryKey: ["customer", "addresses", "me"] });
    }
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return id;
    },
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
