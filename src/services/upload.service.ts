type PresignedUploadResponse = {
  uploadUrl: string;
  fileUrl: string;
  key: string;
};

export const uploadService = {
  uploadFileToS3: async (file: File) => {
    const presignedResponse = await fetch('/api/upload/presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
      }),
    });

    if (!presignedResponse.ok) {
      throw new Error('Could not prepare file upload');
    }

    const data = (await presignedResponse.json()) as PresignedUploadResponse;

    const uploadResponse = await fetch(data.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Could not upload file to S3');
    }

    return data.fileUrl;
  },
};
