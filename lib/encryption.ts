// 生成随机密钥
async function generateKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// 将密钥转换为base64字符串
async function exportKeyToBase64(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(exported)))
  );
}

// 从base64字符串导入密钥
async function importKeyFromBase64(keyStr: string): Promise<CryptoKey> {
  const keyBuffer = Uint8Array.from(atob(keyStr), (c) => c.charCodeAt(0));
  return await window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// 加密文件
async function encryptFile(
  file: File
): Promise<{ encryptedFile: Blob; key: string }> {
  const key = await generateKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const fileBuffer = await file.arrayBuffer();

  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    fileBuffer
  );

  const encryptedFile = new Blob([iv, encryptedContent], {
    type: 'application/octet-stream',
  });
  const keyBase64 = await exportKeyToBase64(key);

  return { encryptedFile, key: keyBase64 };
}

// 解密文件
async function decryptFile(
  encryptedBlob: Blob,
  keyBase64: string
): Promise<Blob> {
  const key = await importKeyFromBase64(keyBase64);
  const encryptedBuffer = await encryptedBlob.arrayBuffer();
  const iv = encryptedBuffer.slice(0, 12);
  const data = encryptedBuffer.slice(12);

  const decryptedContent = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    key,
    data
  );

  return new Blob([decryptedContent]);
}

export { encryptFile, decryptFile };
