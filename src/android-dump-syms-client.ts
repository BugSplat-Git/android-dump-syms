import { ApiClient, BugSplatResponse, OAuthClientCredentialsClient } from "@bugsplat/js-api-client";
import { createStreamableFile } from 'node-streamable-file';

export class AndroidDumpSymsClient {
    private constructor(public authenticatedClient: ApiClient) { }

    async upload(path: string): Promise<BugSplatResponse> {
        const formData = new FormData();
        const file = await createStreamableFile(path);
        formData.append('file', file as unknown as Blob);

        return this.authenticatedClient.fetch('/post/android/symbols', {
            method: 'POST',
            body: formData,
            duplex: 'half'
        } as any);
    }

    static async create(database: string, clientId: string, clientSecret: string, host?: string | undefined): Promise<AndroidDumpSymsClient> {
        host = host ?? `https://${database}.bugsplat.com`;
        const client = await OAuthClientCredentialsClient.createAuthenticatedClient(clientId, clientSecret, host);
        
        return new AndroidDumpSymsClient(client);
    }
}
