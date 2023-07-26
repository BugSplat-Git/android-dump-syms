import fs from 'fs';
import * as streamWeb from 'node:stream/web';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

export async function writeFile(path: string, readstream: ReadableStream): Promise<void> {
    const readable = readstream as streamWeb.ReadableStream<any>;
    const fileStream = fs.createWriteStream(path, { flags: 'wx' });
    await finished(Readable.fromWeb(readable).pipe(fileStream));
}