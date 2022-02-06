import axios from 'axios';
import * as FormData from 'form-data';
import { createCustomRunner } from 'nx-remotecache-custom';
import { Stream } from 'stream';

// https://stackoverflow.com/questions/14269233/node-js-how-to-read-a-stream-into-a-buffer
async function streamToBuffer(stream: Stream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const buffer: Uint8Array[] = [];

    stream.on('data', (chunk) => buffer.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(buffer)));
    stream.on('error', (err) => reject(err));
  });
}

export const taskRunner = createCustomRunner<{ url: string }>(
  async (options) => {
    return {
      name: 'NXMN Task Runner',
      fileExists: async (filename) => {
        try {
          const response = await axios.head(`${options.url}/cache/${filename}`);
          return response.status === 200;
        } catch (e) {
          return false;
        }
      },
      retrieveFile: async (filename) => {
        const response = await axios.get(`${options.url}/cache/${filename}`, {
          responseType: 'stream',
        });
        return streamToBuffer(response.data);
      },
      storeFile: async (filename, buffer) => {
        const form = new FormData();
        form.append('file', Buffer.from(buffer), filename);
        return axios.post(`${options.url}/cache`, form, {
          headers: form.getHeaders(),
        });
      },
    };
  }
);
