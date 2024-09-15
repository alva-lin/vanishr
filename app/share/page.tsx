import { FileDownload } from '@/components/FileDownload';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SharePage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">View Shared File</h1>
        <FileDownload />
        <div className="mt-12 text-center">
          <p className="text-xl mb-4">Want to share your own file?</p>
          <Button asChild size="lg">
            <Link href="/#upload">Upload Now</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
