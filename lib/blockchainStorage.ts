const AGGREGATOR = 'https://aggregator-devnet.walrus.space';
const PUBLISHER = 'https://publisher-devnet.walrus.space';

export { uploadToBlockchain, downloadFromBlockchain };

// 上传文件到区块链
async function uploadToBlockchain(
  file: Blob,
  epochs: number = 1
): Promise<UploadResult> {
  const url = new URL(`${PUBLISHER}/v1/store`);
  url.searchParams.append('epochs', epochs.toString());

  const response = await fetch(url.toString(), {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload file to blockchain');
  }

  const result: UploadResponse = await response.json();

  if ('newlyCreated' in result) {
    return {
      blobId: result.newlyCreated.blobObject.blobId,
      endEpoch: result.newlyCreated.blobObject.storage.endEpoch,
      isNewlyCreated: true,
    };
  } else {
    return {
      blobId: result.alreadyCertified.blobId,
      endEpoch: result.alreadyCertified.endEpoch,
      isNewlyCreated: false,
    };
  }
}

// 从区块链下载文件
async function downloadFromBlockchain(fileId: string): Promise<Blob> {
  const response = await fetch(`${AGGREGATOR}/v1/${fileId}`);

  if (!response.ok) {
    throw new Error('Failed to download file from blockchain');
  }

  return await response.blob();
}

// 定义返回体类型
interface NewlyCreatedResponse {
  newlyCreated: {
    blobObject: {
      id: string;
      storedEpoch: number;
      blobId: string;
      size: number;
      erasureCodeType: string;
      certifiedEpoch: number;
      storage: {
        id: string;
        startEpoch: number;
        endEpoch: number;
        storageSize: number;
      };
    };
    encodedSize: number;
    cost: number;
  };
}

interface AlreadyCertifiedResponse {
  alreadyCertified: {
    blobId: string;
    event: {
      txDigest: string;
      eventSeq: string;
    };
    endEpoch: number;
  };
}

type UploadResponse = NewlyCreatedResponse | AlreadyCertifiedResponse;

interface UploadResult {
  blobId: string;
  endEpoch: number;
  isNewlyCreated: boolean;
}
