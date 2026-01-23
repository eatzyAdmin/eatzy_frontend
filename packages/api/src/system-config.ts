import { http } from "./http";
import { IBackendRes, SystemParameter, ResultPaginationDTO } from "../../types/src";

export const systemConfigApi = {
  /**
   * Get all system configurations
   * GET /api/v1/system-configurations
   */
  getAllConfigs: async (params?: {
    page?: number;
    size?: number;
    filter?: string;
  }): Promise<IBackendRes<ResultPaginationDTO<SystemParameter[]>>> => {
    return http.get<IBackendRes<ResultPaginationDTO<SystemParameter[]>>>("/api/v1/system-configurations", {
      params,
    }) as unknown as Promise<IBackendRes<ResultPaginationDTO<SystemParameter[]>>>;
  },

  /**
   * Get configuration by key
   * GET /api/v1/system-configurations/key/{configKey}
   */
  getConfigByKey: async (key: string): Promise<IBackendRes<SystemParameter>> => {
    return http.get<IBackendRes<SystemParameter>>(`/api/v1/system-configurations/key/${key}`) as unknown as Promise<IBackendRes<SystemParameter>>;
  },

  /**
   * Update system configuration
   * PUT /api/v1/system-configurations
   */
  updateConfig: async (config: Partial<SystemParameter> & { id: number }): Promise<IBackendRes<SystemParameter>> => {
    return http.put<IBackendRes<SystemParameter>>("/api/v1/system-configurations", config) as unknown as Promise<IBackendRes<SystemParameter>>;
  },
};
