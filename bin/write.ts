import fs from 'fs';
import * as streamWeb from 'node:stream/web';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { fileExists } from './exists';
import { unlink } from 'fs/promises';

export async function writeFile(path: string, readstream: ReadableStream): Promise<void> {
    const exists = await fileExists(path);
    
    if (exists) {
        await unlink(path);
    }

    const readable = readstream as streamWeb.ReadableStream<any>;
    const fileStream = fs.createWriteStream(path, { flags: 'wx' });
    await finished(Readable.fromWeb(readable).pipe(fileStream));
}