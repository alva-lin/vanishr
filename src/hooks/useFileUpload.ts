import { uploadToBlockchain } from '@/lib/blockchainStorage';
import { encryptFile } from '@/lib/encryption';
import { useState } from 'react';

// 上传加密文件
async function uploadEncryptedFile(file: File, epochs: number = 1) {
  const { encryptedFile, key } = await encryptFile(file);
  const { blobId, endEpoch, isNewlyCreated } = await uploadToBlockchain(encryptedFile, epochs);
  return { blobId, endEpoch, isNewlyCreated, key };
}

interface UploadResultInfo {
  blobId: string;
  key: string;
  fileName: string;
  fileType: string;
  endEpoch: number;
}

export function useFileUpload() {
  const [result, setResult] = useState<UploadResultInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewlyCreated, setIsNewlyCreated] = useState<boolean | null>(null);

  const upload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadEncryptedFile(file);
      setResult({
        blobId: result.blobId,
        key: result.key,
        fileName: file.name,
        fileType: file.type,
        endEpoch: result.endEpoch,
      });
      setIsNewlyCreated(result.isNewlyCreated);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
      setResult(null);
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, result, isUploading, error, isNewlyCreated };
}
