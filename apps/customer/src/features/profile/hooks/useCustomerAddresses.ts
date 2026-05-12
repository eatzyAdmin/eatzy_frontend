import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IAddress } from "@repo/types";
import { sileo } from "@/components/DynamicIslandToast";
import { addressApi } from "@repo/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCallback } from "react";

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
        title: "Address Added Successfully",
        description: "Your new address has been saved."
      });
      queryClient.invalidateQueries({ queryKey: ["customer", "addresses", "me"] });
    }
  });

  const updateAddressMutation = useMutation({
    mutationFn: (updatedAddress: IAddress) => addressApi.updateAddress(updatedAddress),
    onSuccess: () => {
      sileo.success({
        title: "Update Successful",
        description: "Address info has been updated."
      });
      queryClient.invalidateQueries({ queryKey: ["customer", "addresses", "me"] });
    }
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: number) => addressApi.deleteAddress(id),
    onSuccess: () => {
      sileo.success({
        title: "Address Deleted",
        description: "The address has been removed from your list."
      });
      queryClient.invalidateQueries({ queryKey: ["customer", "addresses", "me"] });
    }
  });

  const refresh = useCallback(async () => {
    await Promise.all([
      queryClient.resetQueries({ queryKey: ["customer", "addresses", "me"] }),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);
  }, [queryClient]);

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
    refresh,
  };
};
