import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getMyDriverProfile, updateDriverProfile } from "../api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DriverProfile } from "@repo/types";
import { sileo } from "@/components/DynamicIslandToast";

const mockDriverProfile: DriverProfile = {
  id: "driver-001",
  user: {
    id: "user-001",
    name: "Driver001",
    email: "driver.eatzy@gmail.com",
    phoneNumber: "0987654321",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    gender: "male",
    age: 28,
    address: "123 Đường Láng, Đống Đa, Hà Nội",
  } as any,
  vehicle_type: "Motorcycle",
  vehicle_brand: "Honda",
  vehicle_model: "Winner X 2024",
  vehicle_license_plate: "29-P1 999.99",
  vehicle_color: "Black Orange",
  bank_name: "Techcombank",
  bank_account_name: "NGUYEN VAN TAI XE",
  bank_account_number: "19034567891011",
  tax_code: "8765432109",
  is_verified: true,
  status: "ACTIVE",
  profile_photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
  identity_card_number: "001095034567",
  registration_certificate_url: "https://example.com/rc.jpg",
  driving_license_url: "https://example.com/dl.jpg",
} as any;

export const useDriverProfile = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<DriverProfile | undefined>({
    queryKey: ["driver", "profile", "me"],
    queryFn: async () => {
      const res = await getMyDriverProfile();
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => updateDriverProfile(data),
    onSuccess: () => {
      sileo.success({
        actionType: "profile_update_success",
        title: "Profile Updated",
        description: "Your information has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["driver", "profile", "me"] });
    },
    onError: (err: any) => {
      sileo.error({
        actionType: "profile_update_error",
        title: "Update Failed",
        description: err.response?.data?.message || "An error occurred while updating your information."
      });
    }
  });

  return {
    profile: data || mockDriverProfile,
    isLoading: false, // Force false to see mock data UI immediately
    isError: false,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    refresh: useCallback(async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["driver", "profile", "me"] }),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
    }, [queryClient]),
  };
};
