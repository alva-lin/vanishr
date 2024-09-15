import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { downloadFromBlockchain } from '@/lib/blockchainStorage';
import { decryptFile } from '@/lib/encryption';
import { MediaPreview } from './MediaPreview';

// 下载并解密文件
async function downloadAndDecryptFile(blobId: string, key: string) {
  const encryptedFile = await downloadFromBlockchain(blobId);
  return await decryptFile(encryptedFile, key);
}

export function FileDownload() {
  const [blobId, setBlobId] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlBlobId = params.get('blobId');
    const urlKey = params.get('key');
    const urlFileName = params.get('fileName');
    const urlFileType = params.get('fileType');

    if (urlBlobId) setBlobId(urlBlobId);
    if (urlKey) setKey(urlKey);
    if (urlFileName) setFileName(urlFileName);
    if (urlFileType) setFileType(urlFileType);
  }, []);

  useEffect(() => {
    if (blobId && key && fileType && (fileType.startsWith('image/') || fileType.startsWith('video/'))) {
      handleDownload(true);
    }
  }, [blobId, key, fileType]);

  const handleDownload = async (preview = false) => {
    if (!blobId || !key || !fileName || !fileType) return;

    setIsDownloading(true);
    try {
      const blob = await downloadAndDecryptFile(blobId, key);
      if (preview) {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${fileName}.${fileType.split('/')[1]}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('下载失败:', error);
      // 这里可以添加错误提示，例如使用 toast 通知
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">下载文件</h2>
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <Label htmlFor="blobId">Blob ID</Label>
          <Input id="blobId" value={blobId} onChange={(e) => setBlobId(e.target.value)} />
        </div>
        <div className="flex-1">
          <Label htmlFor="key">Key</Label>
          <Input id="key" value={key} onChange={(e) => setKey(e.target.value)} />
        </div>
        <div className="flex-1">
          <Label htmlFor="fileName">File Name</Label>
          <Input id="fileName" value={fileName} onChange={(e) => setFileName(e.target.value)} />
        </div>
        <div className="flex-1">
          <Label htmlFor="fileType">File Type</Label>
          <Input id="fileType" value={fileType} onChange={(e) => setFileType(e.target.value)} />
        </div>
      </div>
      <Button onClick={() => handleDownload(false)} disabled={!blobId || !key || !fileName || !fileType || isDownloading}>
        {isDownloading ? '下载中...' : '下载'}
      </Button>
      {previewUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">预览</h3>
          <MediaPreview blobUrl={previewUrl} fileType={fileType} />
        </div>
      )}
    </div>
  );
}
