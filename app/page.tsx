'use client';

import { FileUpload } from '@/components/FileUpload';
import { FileDownload } from '@/components/FileDownload';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vanishr - Secure File Sharing</h1>
      <FileUpload />
      <FileDownload />
    </main>
  );
}
