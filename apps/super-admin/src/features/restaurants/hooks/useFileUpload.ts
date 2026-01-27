'use client';

import { useState } from 'react';
import { fileApi } from '@repo/api';
import { useNotification } from '@repo/ui';

export function useFileUpload() {
  const { showNotification } = useNotification();
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File, folder: string = 'general') => {
    setIsUploading(true);
    try {
      const res = await fileApi.uploadFile(file, folder);
      if (res.data?.fileName) {
        return res.data.fileName;
      }
      throw new Error('Upload failed: No file name returned');
    } catch (error: any) {
      showNotification({
        message: error.message || 'Upload failed',
        type: 'error'
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading
  };
}
