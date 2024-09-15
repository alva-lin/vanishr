import { useState, useEffect } from 'react';

interface MediaPreviewProps {
  blobUrl: string;
  fileType: string;
}

export function MediaPreview({ blobUrl, fileType }: MediaPreviewProps) {
  const [isImage, setIsImage] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    setIsImage(fileType.startsWith('image/'));
    setIsVideo(fileType.startsWith('video/'));
  }, [fileType]);

  if (isImage) {
    return <img src={blobUrl} alt="预览图片" className="max-w-full h-auto" />;
  }

  if (isVideo) {
    return (
      <video controls className="max-w-full h-auto">
        <source src={blobUrl} type={fileType} />
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
}
