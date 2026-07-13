'use client';

import { useState } from 'react';

import { toaster } from '@/components/ui/toaster';
import { uploadService } from '@/services/upload.service';

export const useUploadFile = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);

      return await uploadService.uploadFileToS3(file);
    } catch {
      toaster.create({
        title: 'Не вдалося завантажити файл',
        type: 'error',
      });

      throw new Error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
  };
};
