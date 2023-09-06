import { ApiClient, BugSplatResponse, OAuthClientCredentialsClient } from "@bugsplat/js-api-client";
import { File } from '@web-std/file';
import { createStreamableFile } from 'node-streamable-file';
import { open } from 'node:fs/promises';
import { basename } from "node:path";

// Polyfill File for pkg because it's not defined until Node.js 18.13
globalThis.File = File;

export class AndroidDumpSymsClient {
    private createStreamableFile = createStreamableFile;
    private open = open;

    private constructor(public authenticatedClient: ApiClient) { }

    async upload(path: string): Promise<BugSplatResponse> {
        const name = basename(path);
        const handle = await this.open(path);
        const file = await this.createStreamableFile(name, handle);
        
        const formData = this.authenticatedClient.createFormData();
        formData.append('file', file as unknown as Blob, name);

        const response = await this.authenticatedClient.fetch('/post/android/symbols', {
            method: 'POST',
            body: formData,
            duplex: 'half'
        } as unknown as RequestInit);

        await handle.close();

        return response;
    }

    static async create(database: string, clientId: string, clientSecret: string, host?: string | undefined): Promise<AndroidDumpSymsClient> {
        host = host ?? `https://${database}.bugsplat.com`;
        const client = await OAuthClientCredentialsClient.createAuthenticatedClient(clientId, clientSecret, host);
        
        return new AndroidDumpSymsClient(client);
    }
}
