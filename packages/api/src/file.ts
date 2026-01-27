
import { http } from "./http";
import { IBackendRes, ResUploadFileDTO } from "../../types";

export const fileApi = {
  uploadFile: (file: File, folder: string = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    return http.post<IBackendRes<ResUploadFileDTO>>("/api/v1/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as unknown as Promise<IBackendRes<ResUploadFileDTO>>;
  },
};
