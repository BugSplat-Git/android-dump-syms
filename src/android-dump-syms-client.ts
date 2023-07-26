import { ApiClient, BugSplatResponse, OAuthClientCredentialsClient } from "@bugsplat/js-api-client";
import { readFile } from "fs/promises";
import { basename } from "path";

export class AndroidDumpSymsClient {
    readFile = readFile;

    private constructor(public authenticatedClient: ApiClient) { }

    async upload(path: string): Promise<BugSplatResponse> {
        // TODO BG streaming implementation
        const formData = this.authenticatedClient.createFormData();
        const file = await this.readFile(path);
        const blob = new Blob([file]);
        formData.append('file', blob, basename(path));
        return this.authenticatedClient.fetch('/post/android/symbols', {
            method: 'POST',
            body: formData
        });
    }

    static async create(clientId: string, clientSecret: string, host?: string | undefined): Promise<AndroidDumpSymsClient> {
        const client = await OAuthClientCredentialsClient.createAuthenticatedClient(clientId, clientSecret, host);
        
        return new AndroidDumpSymsClient(client);
    }
}