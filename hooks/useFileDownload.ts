import { decryptFile } from '@/lib/encryption';
import { downloadFromBlockchain } from '@/lib/blockchainStorage';

import { useState } from 'react';

// 下载并解密文件
async function downloadAndDecryptFile(blobId: string, key: string) {
  const encryptedFile = await downloadFromBlockchain(blobId);
  return await decryptFile(encryptedFile, key);
}

export function useFileDownload() {
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [blobId, setBlobId] = useState<string>('');
  const [key, setKey] = useState<string>('');

  const handleDownload = async () => {
    if (blobId && key) {
      try {
        const decryptedFile = await downloadAndDecryptFile(blobId, key);
        const url = URL.createObjectURL(decryptedFile);
        setDownloadLink(url);
      } catch (error) {
        console.error('Download failed:', error);
        setDownloadLink(null);
      }
    }
  };

  return { downloadLink, blobId, key, setBlobId, setKey, handleDownload };
}
