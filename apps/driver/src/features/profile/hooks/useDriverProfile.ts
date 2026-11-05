import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getMyDriverProfile, updateDriverProfile } from "../api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DriverProfile, UpdateDriverProfileDto } from "@repo/types";
import { driverProfileError } from "@repo/api";
import { sileo } from "@/components/DynamicIslandToast";

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
    mutationFn: (data: UpdateDriverProfileDto) => updateDriverProfile(data),
    onSuccess: () => {
      sileo.success({
        actionType: "profile_update_success",
        title: "Profile Updated",
        description: "Your information has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["driver", "profile", "me"] });
    },
    onError: (err: unknown) => {
      sileo.error({
        actionType: "profile_update_error",
        title: "Update Failed",
        description: driverProfileError(err).message
      });
    }
  });

  return {
    profile: data,
    isLoading,
    isError,
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
