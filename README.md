[![bugsplat-github-banner-basic-outline](https://user-images.githubusercontent.com/20464226/149019306-3186103c-5315-4dad-a499-4fd1df408475.png)](https://bugsplat.com)
<br/>
# <div align="center">BugSplat</div> 
### **<div align="center">Crash and error reporting built for busy developers.</div>**
<div align="center">
    <a href="https://twitter.com/BugSplatCo">
        <img alt="Follow @bugsplatco on Twitter" src="https://img.shields.io/twitter/follow/bugsplatco?label=Follow%20BugSplat&style=social">
    </a>
    <a href="https://discord.gg/bugsplat">
        <img alt="Join BugSplat on Discord" src="https://img.shields.io/discord/664965194799251487?label=Join%20Discord&logo=Discord&style=social">
    </a>
</div>

<br/>

# android-dump-syms

Leverage the BugSplat API to convert Android binaries to Crashpad compatible `.sym` files.

## Command Line

1. Install this package globally `npm i -g @bugsplat/android-dump-syms`
2. Run symbol-upload with `-h` to see the latest usage information:

```bash
bobby@BugSplat % ~ % android-dump-syms -h

@bugsplat/android-dump-syms

 TODO BG cli output
```
3. Run android-dump-syms passing it the path to the Android binary file to use to generate a `.sym`.

## API

1. Install this package locally `npm i @bugsplat/android-dump-syms`.
2. Import `BugSplatApiClient` and `VersionsApiClient` from @bugsplat/symbol-upload. Alternatively, you can import `OAuthClientCredentialsClient` if you'd prefer to authenticate with an [OAuth2 Client Credentials](https://docs.bugsplat.com/introduction/development/web-services/oauth2#client-credentials) Client ID and Client Secret.

```ts
import { BugSplatApiClient, OAuthClientCredentialsClient, VersionsApiClient } from '@bugsplat/symbol-upload';
```

3. Create a new instance of `BugSplatApiClient` using the `createAuthenticatedClientForNode` async factory function or `OAuthClientCredentialsClient` using the `createAuthenticatedClient` async factory function.

```ts
const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(email, password);
```

```ts
const bugsplat = await OAuthClientCredentialsClient.createAuthenticatedClient(clientId, clientSecret);
```

4. Create an `UploadableFile` object for each symbol file path.

```ts
const files = paths.map(path => {
  const stat = fs.statSync(path);
  const size = stat.size;
  const name = basename(path);
  const file = fs.createReadStream(path);
  return {
          name,
          size,
          file
  };
});
```

5. Create an instance of `VersionsApiClient` passing it an instance of `BugSplatApiClient`.

```ts
const versionsApiClient = new VersionsApiClient(bugsplat);
```

6. Await the call to `postSymbols` passing it the name of your BugSplat `database`, `application`, `version` and an array of `files`. These values need to match the values you used to initialize BugSplat on whichever [platform](https://docs.bugsplat.com/introduction/getting-started/integrations) you've integrated with.

```ts
await versionsApiClient.postSymbols(
  database,
  application,
  version,
  files
);
```

If you've done everything correctly your symbols should now be shown on the [Versions](https://app.bugsplat.com/v2/versions) page.

![Versions](https://bugsplat-public.s3.amazonaws.com/npm/symbol-upload/versions.png)

Thanks for using BugSplat!
