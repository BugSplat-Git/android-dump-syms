import { ApiClient, BugSplatApiClient, BugSplatResponse, OAuthClientCredentialsClient } from "@bugsplat/js-api-client";
import { createReadStream } from "fs";
import { readFile } from "fs/promises";
import { basename } from "path";

export class AndroidDumpSymClient {
    createReadStream = createReadStream;

    private constructor(public authenticatedClient: ApiClient) { }

    async upload(path: string): Promise<BugSplatResponse> {
        // TODO BG streaming implementation
        const formData = this.authenticatedClient.createFormData();
        const file = await readFile(path);
        const blob = new Blob([file]);
        formData.append('file', blob, basename(path));
        return this.authenticatedClient.fetch('/api/android/symbols.php', {
            method: 'POST',
            body: formData
        });
    }

    static async createWithUsernameAndPassword(user: string, password: string, host?: string | undefined): Promise<AndroidDumpSymClient> {
        const client = await BugSplatApiClient.createAuthenticatedClientForNode(user, password, host);
        
        return new AndroidDumpSymClient(client);
   }

    static async createWithOAuth(clientId: string, clientSecret: string, host?: string | undefined): Promise<AndroidDumpSymClient> {
        const client = await OAuthClientCredentialsClient.createAuthenticatedClient(clientId, clientSecret, host);
        
        return new AndroidDumpSymClient(client);
    }
}