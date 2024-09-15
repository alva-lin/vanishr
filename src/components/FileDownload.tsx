import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { downloadFromBlockchain } from '@/lib/blockchainStorage';
import { decryptFile } from '@/lib/encryption';
import { MediaPreview } from './MediaPreview';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// 下载并解密文件
async function downloadAndDecryptFile(blobId: string, key: string) {
  const encryptedFile = await downloadFromBlockchain(blobId);
  return await decryptFile(encryptedFile, key);
}

export function FileDownload() {
  const [searchParams] = useSearchParams();
  const [blobId, setBlobId] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const urlBlobId = searchParams.get('blobId');
    const urlKey = searchParams.get('key');
    const urlFileName = searchParams.get('fileName');
    const urlFileType = searchParams.get('fileType');

    if (urlBlobId) setBlobId(urlBlobId);
    if (urlKey) setKey(urlKey);
    if (urlFileName) setFileName(urlFileName);
    if (urlFileType) setFileType(urlFileType);
  }, [searchParams]);

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
      console.error('Download failed:', error);
      // 这里可以添加错误提示，例如使用 toast 通知
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>View Shared Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="blobId">Blob ID</Label>
            <Input id="blobId" value={blobId} onChange={(e) => setBlobId(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="key">Key</Label>
            <Input id="key" value={key} onChange={(e) => setKey(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="fileName">File Name</Label>
            <Input id="fileName" value={fileName} onChange={(e) => setFileName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="fileType">File Type</Label>
            <Input id="fileType" value={fileType} onChange={(e) => setFileType(e.target.value)} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch">
        <Button
          onClick={() => handleDownload(false)}
          disabled={!blobId || !key || !fileName || !fileType || isDownloading}
          className="w-full mb-4"
        >
          {isDownloading ? 'Loading...' : 'Save'}
        </Button>
        {previewUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <MediaPreview blobUrl={previewUrl} fileType={fileType} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
