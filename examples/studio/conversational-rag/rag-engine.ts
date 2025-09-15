import { AI21, FileResponse, UploadFileResponse } from 'ai21';
import path from 'path';
import fs from 'fs';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForFileProcessing(
  client: AI21,
  fileId: string,
  timeout: number = 30000,
  interval: number = 1000,
) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const file: FileResponse = await client.library.files.get(fileId);
    if (file.status !== 'PROCESSING') {
      return file;
    }
    await sleep(interval);
  }

  throw new Error(`File processing timed out after ${timeout}ms`);
}

async function uploadGetUpdateDelete(fileInput, path) {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });
  try {
    console.log(`Starting upload for file:`, typeof fileInput);
    const uploadFileResponse: UploadFileResponse = await client.library.files.create({
      file: fileInput,
      path: path,
    });
    console.log(`✓ Upload completed. File ID: ${uploadFileResponse.fileId}`);

    console.log('Waiting for file processing...');
    let file: FileResponse = await waitForFileProcessing(client, uploadFileResponse.fileId);
    console.log(`✓ File processing completed with status: ${file.status}`);

    if (file.status === 'PROCESSED') {
      console.log('Starting file update...');
      await client.library.files.update({
        fileId: uploadFileResponse.fileId,
        labels: ['test99'],
        publicUrl: 'https://www.miri.com',
      });
      file = await client.library.files.get(uploadFileResponse.fileId);
      console.log('✓ File update completed');
    } else {
      console.log(`⚠ File processing failed with status ${file.status}`);
      return; // Exit early if processing failed
    }

    console.log('Starting file deletion...');
    await client.library.files.delete(uploadFileResponse.fileId);
    console.log('✓ File deletion completed');

    // Add buffer time between operations
    await sleep(2000);
  } catch (error) {
    console.error('❌ Error in uploadGetUpdateDelete:', error);
    throw error;
  }
}

async function listFiles() {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });
  const files = await client.library.files.list({ limit: 4 });
  console.log(`Listed files: ${files}`);
}

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

const createNodeFile = (content: Buffer, filename: string, type: string) => {
  if (process.platform === 'linux') {
    console.log('Running on Linux (GitHub Actions)');
    // Special handling for Linux (GitHub Actions)
    return {
      name: filename,
      type: type,
      buffer: content,
      [Symbol.toStringTag]: 'File',
    };
  } else {
    console.log('Running on other platforms');
    // Regular handling for other platforms
    return new File([content], filename, { type });
  }
};

if (isBrowser) {
  console.log('Cannot run upload examples in Browser environment');
} else {
  /* Log environment details */
  console.log('=== Environment Information ===');
  console.log(`Node.js Version: ${process.version}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Architecture: ${process.arch}`);
  console.log(`Process ID: ${process.pid}`);
  console.log(`Current Working Directory: ${process.cwd()}`);
  console.log('===========================\n');

  /* Run all operations sequentially */
  (async () => {
    try {
      console.log('=== Starting first operation ===');
      // First operation - upload file from path
      const filePath = path.resolve(process.cwd(), 'examples/studio/conversational-rag/files', 'meerkat.txt');
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      } else {
        console.log(`File found: ${filePath}`);
      }

      await uploadGetUpdateDelete(filePath, Date.now().toString());
      console.log('=== First operation completed ===\n');
      await sleep(2000);

      console.log('=== Starting second operation ===');
      // Second operation - upload file from File instance
      const fileContent = Buffer.from(
        'Opossums are members of the marsupial order Didelphimorphia endemic to the Americas.',
      );
      const dummyFile = createNodeFile(fileContent, 'example.txt', 'text/plain');
      await uploadGetUpdateDelete(dummyFile, Date.now().toString());
      console.log('=== Second operation completed ===\n');
      await sleep(2000);

      console.log('=== Starting file listing ===');
      await listFiles();
      console.log('=== File listing completed ===');
    } catch (error) {
      console.error('❌ Main execution error:', error);
      process.exit(1); // Exit with error code if something fails
    }
  })();
}
