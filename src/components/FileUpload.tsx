import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const { upload, reset, result, isUploading, error, isNewlyCreated } = useFileUpload();
  const [shareableLink, setShareableLink] = useState<string>('');

  useEffect(() => {
    if (result) {
      const params = new URLSearchParams({
        blobId: result.blobId,
        key: result.key,
        fileName: result.fileName,
        fileType: result.fileType,
      });
      const link = `${window.location.origin}/#/share?${params.toString()}`;
      setShareableLink(link);
    }
  }, [result]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setShareableLink('');
      reset();
    }
  };

  const handleUpload = async () => {
    if (file) {
      await upload(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Share</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Select File</Label>
            <Input id="file-upload" type="file" onChange={handleFileChange} className="mt-1" />
          </div>
          <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {result && !isNewlyCreated && (
          <div className="mt-4 space-y-2">
            <p className="font-semibold">File uploaded successfully!</p>
          </div>
        )}
      </CardContent>
      {shareableLink && (
        <CardFooter className="flex-col items-stretch">
          <Label htmlFor="shareable-link">Shareable Link:</Label>
          <div className="flex mt-1">
            <Input id="shareable-link" value={shareableLink} readOnly className="flex-grow" />
            <Button onClick={() => navigator.clipboard.writeText(shareableLink)} className="ml-2">
              Copy
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
