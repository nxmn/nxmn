import { Axios } from 'axios';
import * as FormData from 'form-data';
import { readFileSync } from 'fs';
import { Agent } from 'https';
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

function parseNumberOrInfinity(maybeNumber: string | number | 'Infinity' | undefined): number | undefined {
  if (typeof maybeNumber === 'number') {
    return maybeNumber;
  }
  if (maybeNumber === 'Infinity') {
    return Infinity;
  }
  if (typeof maybeNumber === 'string') {
    return parseInt(maybeNumber, 10);
  }
  return undefined;
}

//TaskRunner
export const taskRunner = createCustomRunner<{
  url: string;
  name?: string;
  caFile?: string;
  maxContentLength?: number | 'Infinity';
  maxBodyLength?: number | 'Infinity';
}>(async (options) => {
  const axios = new Axios({
    baseURL: options.url,
    maxContentLength: parseNumberOrInfinity(options.maxContentLength),
    maxBodyLength: parseNumberOrInfinity(options.maxBodyLength),
    httpsAgent: options.caFile ? new Agent({ ca: readFileSync(options.caFile) }) : undefined,
  });

  return {
    name: options?.name ?? 'NXMN Task Runner',
    fileExists: async (filename) => {
      try {
        const response = await axios.head(`/cache/${filename}`);
        return response.status === 200;
      } catch (e) {
        return false;
      }
    },
    retrieveFile: async (filename) => {
      const response = await axios.get(`/cache/${filename}`, {
        responseType: 'stream',
      });
      return streamToBuffer(response.data);
    },
    storeFile: async (filename, buffer) => {
      const form = new FormData();
      form.append('cache', Buffer.from(buffer), filename);
      return axios.post(`/cache`, form, {
        headers: form.getHeaders(),
      });
    },
  };
});
