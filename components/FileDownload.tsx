import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFileDownload } from '@/hooks/useFileDownload';

export function FileDownload() {
  const { downloadLink, blobId, key, setBlobId, setKey, handleDownload } = useFileDownload();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Download File</h2>
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <Label htmlFor="blobId">Blob ID</Label>
          <Input id="blobId" value={blobId} onChange={(e) => setBlobId(e.target.value)} />
        </div>
        <div className="flex-1">
          <Label htmlFor="key">Key</Label>
          <Input id="key" value={key} onChange={(e) => setKey(e.target.value)} />
        </div>
      </div>
      <Button onClick={handleDownload} disabled={!blobId || !key}>
        Download
      </Button>
      {downloadLink && (
        <p className="mt-2">
          <a href={downloadLink} download className="text-blue-500 hover:underline">
            Click here to download your file
          </a>
        </p>
      )}
    </div>
  );
}
