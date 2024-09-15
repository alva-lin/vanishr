import { FileUpload } from '@/components/FileUpload';

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">Secure Sharing, Instant Disappearance</h1>
      <p className="text-xl mb-8">
        Vanishr is a blockchain-based decentralized secure file sharing platform.
        Encrypt your files, share, and then permanently delete.
        True privacy, with no centralized data collection.
      </p>
      <FileUpload />
    </div>
  );
}
