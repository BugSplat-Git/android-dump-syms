import { blobFrom } from '@bugsplat/fetch-blob/dist/from';
import { ApiClient, BugSplatResponse, OAuthClientCredentialsClient } from '@bugsplat/js-api-client';
import { basename } from 'node:path';

export class AndroidDumpSymsClient {
    private blobFrom = blobFrom

    private constructor(public authenticatedClient: ApiClient) { }

    async upload(path: string): Promise<BugSplatResponse> {
        const name = basename(path);
        const formData = this.authenticatedClient.createFormData();
        formData.append('file', await this.blobFrom(path), name);

        return this.authenticatedClient.fetch('/post/android/symbols', {
            method: 'POST',
            body: formData,
            duplex: 'half'
        } as unknown as RequestInit);
    }

    static async create(database: string, clientId: string, clientSecret: string, host?: string | undefined): Promise<AndroidDumpSymsClient> {
        host = host ?? `https://${database}.bugsplat.com`;
        const client = await OAuthClientCredentialsClient.createAuthenticatedClient(clientId, clientSecret, host);
        
        return new AndroidDumpSymsClient(client);
    }
}
