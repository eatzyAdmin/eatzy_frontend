import { http } from "./http";
import { IBackendRes, DriverProfile, CreateDriverProfileDto, UpdateDriverProfileDto, ResultPaginationDTO, DriverKycRevision, SubmitDriverKycRevision } from "../../types/src";

export const driverApi = {
  // Go online
  goOnline: () => {
    return http.post<IBackendRes<DriverProfile>>("/api/v1/driver-profiles/go-online", {}) as unknown as Promise<IBackendRes<DriverProfile>>;
  },

  // Go offline
  goOffline: () => {
    return http.post<IBackendRes<DriverProfile>>("/api/v1/driver-profiles/go-offline", {}) as unknown as Promise<IBackendRes<DriverProfile>>;
  },

  // Get current driver status
  getMyDriverStatus: () => {
    return http.get<IBackendRes<{ status: string }>>("/api/v1/driver-profiles/my-profile/status") as unknown as Promise<IBackendRes<{ status: string }>>;
  },

  // Get driver profile
  getMyProfile: () => {
    return http.get<IBackendRes<DriverProfile>>("/api/v1/driver-profiles/my-profile") as unknown as Promise<IBackendRes<DriverProfile>>;
  },

  // Admin: Get all driver profiles
  getAllDriverProfiles: (params: any) => {
    return http.get<IBackendRes<ResultPaginationDTO<DriverProfile[]>>>("/api/v1/driver-profiles", { params }) as unknown as Promise<IBackendRes<ResultPaginationDTO<DriverProfile[]>>>;
  },

  // Admin: Get driver profile by id
  getDriverProfileById: (id: number) => {
    return http.get<IBackendRes<DriverProfile>>(`/api/v1/driver-profiles/${id}`) as unknown as Promise<IBackendRes<DriverProfile>>;
  },

  // Admin: Create driver profile
  createDriverProfile: (data: CreateDriverProfileDto) => {
    return http.post<IBackendRes<DriverProfile>>("/api/v1/driver-profiles", data) as unknown as Promise<IBackendRes<DriverProfile>>;
  },

  // Admin: Update driver profile
  updateDriverProfile: (data: UpdateDriverProfileDto) => {
    const { kycEligible, kycRevisionState, ...body } = data;
    return http.put<IBackendRes<DriverProfile>>("/api/v1/driver-profiles", body) as unknown as Promise<IBackendRes<DriverProfile>>;
  },

  submitKycRevision: (id: number, data: SubmitDriverKycRevision) =>
    http.post<IBackendRes<DriverProfile>>(`/api/v1/driver-profiles/${id}/kyc-revisions`, data) as unknown as Promise<IBackendRes<DriverProfile>>,

  getKycHistory: (id: number, page = 0) =>
    http.get<IBackendRes<ResultPaginationDTO<DriverKycRevision[]>>>(`/api/v1/driver-profiles/${id}/kyc-revisions`, { params: { page: page + 1, size: 10 } }) as unknown as Promise<IBackendRes<ResultPaginationDTO<DriverKycRevision[]>>>,

  getPendingKycRevisions: (page = 0) =>
    http.get<IBackendRes<ResultPaginationDTO<DriverKycRevision[]>>>("/api/v1/driver-kyc-revisions/pending", { params: { page: page + 1, size: 20 } }) as unknown as Promise<IBackendRes<ResultPaginationDTO<DriverKycRevision[]>>>,

  reviewKycRevision: (id: number, revisionId: number, expectedVersion: number, decision: 'APPROVE' | 'REJECT', reason?: string) =>
    http.post<IBackendRes<DriverProfile>>(`/api/v1/driver-profiles/${id}/kyc-revisions/${revisionId}/review`, { expectedVersion, decision, reason }) as unknown as Promise<IBackendRes<DriverProfile>>,

  // Admin: Delete driver profile
  deleteDriverProfile: (id: number) => {
    return http.delete<IBackendRes<void>>(`/api/v1/driver-profiles/${id}`) as unknown as Promise<IBackendRes<void>>;
  }
};
