import { http } from "./http";
import { IBackendRes } from "../../types";

export interface DriverProfileDTO {
  id: number;
  userId: number;
  fullName: string;
  phoneNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  status: string;
  currentLat: number;
  currentLng: number;
  averageRating: number;
  totalOrders: number;
  isAvailable: boolean;
  online: boolean;
}

export const driverApi = {
  // Go online
  goOnline: () => {
    return http.post<IBackendRes<DriverProfileDTO>>("/api/v1/driver-profiles/go-online", {});
  },

  // Go offline
  goOffline: () => {
    return http.post<IBackendRes<DriverProfileDTO>>("/api/v1/driver-profiles/go-offline", {});
  },

  // Get current driver status
  getMyDriverStatus: () => {
    return http.get<IBackendRes<{ status: string }>>("/api/v1/driver-profiles/my-profile/status");
  },

  // Get driver profile
  getMyProfile: () => {
    return http.get<IBackendRes<DriverProfileDTO>>("/api/v1/driver-profiles/my-profile");
  }
};
