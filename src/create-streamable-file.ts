// TODO BG replace this file with node-streamable-file when pkg ships with node 18.13.0 or greater
// https://nodejs.org/docs/latest-v18.x/api/all.html#all_buffer_class-file
import { File } from '@web-std/file'
import { open } from 'node:fs/promises';
import { basename } from 'node:path';

export async function createStreamableFile(path: string): Promise<File> {
    const name = basename(path);
    const handle = await open(path);
    const { size } = await handle.stat();

    const file = new File([], name);
    file.stream = () => handle.readableWebStream() as ReadableStream<Uint8Array>;

    // Set correct size otherwise fetch will encounter UND_ERR_REQ_CONTENT_LENGTH_MISMATCH
    Object.defineProperty(file, 'size', { get: () => size });

    return file;
}