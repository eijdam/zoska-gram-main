import { put } from '@vercel/blob';

export async function uploadToBlob(file: File | Buffer, filename: string) {
  try {
    // Validate inputs
    if (!file) {
      throw new Error('No file provided');
    }

    if (!filename || filename.trim() === '') {
      throw new Error('Invalid filename');
    }

    // Validate file size (5MB limit)
    if (file instanceof File && file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit');
    }

    // Sanitize filename
    const sanitizedFilename = filename
      .replace(/[^a-zA-Z0-9-_\.]/g, '_')
      .toLowerCase();

    // Check if BLOB token exists
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('Blob storage token not configured');
    }

    const blob = await put(sanitizedFilename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true, // Ensures unique filenames
      contentType: file instanceof File ? file.type : 'application/octet-stream',
    });

    return blob.url;
  } catch (error) {
    console.error('Error uploading to blob:', error);
    throw error instanceof Error ? error : new Error('Failed to upload file');
  }
}