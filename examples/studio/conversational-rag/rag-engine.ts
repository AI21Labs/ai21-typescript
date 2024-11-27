import { AI21 } from 'ai21';
import { FilePathOrFileObject, FileResponse, UploadFileResponse } from '../../../src/types/rag';

async function waitForFileProcessing(
  client: AI21,
  fileId: string,
  interval: number = 3000,
): Promise<FileResponse> {
  while (true) {
    const file: FileResponse = await client.ragEngine.get(fileId);

    if (file.status === 'PROCESSED') {
      return file;
    }

    console.log(`File status is '${file.status}'. Waiting for it to be 'PROCESSED'...`);
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

async function uploadQueryUpdateDelete(fileInput) {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });
  try {
    const uploadFileResponse: UploadFileResponse = await client.ragEngine.create(
      fileInput,
      { path: 'test10' },
    );


    const fileId = uploadFileResponse.fileId;
    let file: FileResponse = await waitForFileProcessing(client, fileId);
    console.log(file);

    console.log('Now updating the file labels');
    await client.ragEngine.update(uploadFileResponse.fileId, {
      labels: ['test99'],
      publicUrl: 'https://www.miri.com',
    });
    file = await client.ragEngine.get(fileId);
    console.log(file);

    console.log('Now deleting the file');
    await client.ragEngine.delete(uploadFileResponse.fileId);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function listFiles() {
  const client = new AI21({ apiKey: process.env.AI21_API_KEY });
  const files = await client.ragEngine.list({ limit: 4 });
  console.log(files);
}

const filePath = '/Users/amirkoblyansky/Documents/ukraine.txt'
const fileContent = Buffer.from('This is the content of the file.');
const dummyFile = new File([fileContent], 'example.txt', { type: 'text/plain' });

uploadQueryUpdateDelete(dummyFile).catch(console.error);

// listFiles().catch(console.error);
