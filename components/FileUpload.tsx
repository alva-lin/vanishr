import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFileUpload } from '@/hooks/useFileUpload';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const { upload, result, isUploading, error, isNewlyCreated } = useFileUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      await upload(file);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Upload File</h2>
      <Input type="file" onChange={handleFileChange} className="mb-2" />
      <Button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {result && (
        <div className="mt-2">
          <p>File uploaded successfully!</p>
          <p>Blob ID: {result.blobId}</p>
          <p>Key: {result.key}</p>
          <p>File Name: {result.fileName}</p>
          <p>File Type: {result.fileType}</p>
          <p>End Epoch: {result.endEpoch}</p>
          <p>Newly Created: {isNewlyCreated ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}
