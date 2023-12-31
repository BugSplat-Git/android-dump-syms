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

  android-dump-syms contains a command line utility and a library to help you   
  generate sym files from Android binaries via the BugSplat API.                

Usage

  -f, --files string (optional)       Glob pattern that specifies a set of android binary files to upload Defaults to '**/*.so'    

  -d, --directory string (optional)   Path of the base directory used to search for symbol files. This value will be combined with the --files glob. Defaults to '.'

  -h, --help                          Print this usage guide.   
                                                      
  -b, --database string               The name of your BugSplat database associated with your Client ID and Client Secret pair. This value can also be provided via the BUGSPLAT_DATABASE environment variable.                                                         

  -i, --clientId string               An OAuth2 Client Credentials Client ID for the specified database. This value can also be provided via the BUGSPLAT_CLIENT_ID environment variable.

  -s, --clientSecret string           An OAuth2 Client Credentials Client Secret for the specified database This value can also be provided via the BUGSPLAT_CLIENT_SECRET environment variable.                                                                     

  The -i and -s arguments are not required if you set the environment variables 
  BUGSPLAT_CLIENT_ID and BUGSPLAT_CLIENT_SECRET.                                

Example

  android-dump-syms glob-for-android-binary-files -d your-bugsplat-database -i your-client-id -s your-client-secret                                          

Links

  🐛 https://bugsplat.com                              
                                                       
  💻 https://github.com/BugSplat-Git/android-dump-syms 
                                                       
  💌 support@bugsplat.com                         
```

3. Run android-dump-syms passing it a path or glob pattern to locate Android binary files to convert to `.sym` files.

## API

1. Install this package locally `npm i @bugsplat/android-dump-syms`.
2. Import `AndroidDumpSymsClient` from @bugsplat/android-dump-syms.

```ts
import { AndroidDumpSymsClient } from '@bugsplat/android-dump-syms';
```

3. Create a new instance of `AndroidDumpSymsClient` using the `create` async factory function.

```ts
const client = await AndroidDumpSymsClient.create(database, clientId, clientSecret);
```

4. Call `upload`, passing the function a path to an Android `.so` file.

```ts
const response = await client.upload('path/to/file.so');
```

5. The `.sym` file can be streamed via the `body` property on the `response` object and written to a file.

```ts
import { BugSplatResponse } from '@bugsplat/android-dump-syms';
import { createWriteStream } from 'fs';
import * as streamWeb from 'node:stream/web';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

export async function writeFile(path: string, response: BugSplatResponse): Promise<void> {
    const readable = response.body as streamWeb.ReadableStream<any>;
    const fileStream = createWriteStream(path, { flags: 'wx' });
    await finished(Readable.fromWeb(readable).pipe(fileStream));
}
```

If you've done everything correctly the resulting file will resemble the following:

```
MODULE Linux arm64 9E957A33B0CDD8A32F80AD65D75601950 MyUnrealCrasher-arm64
INFO CODE_ID 337A959ECDB0A3D82F80AD65D756019583483F98
FILE 0 /Users/Shared/Epic Games/UE_5.2/Engine/Source/Runtime/Core/Public/Containers/ContainerAllocationPolicies.h
FILE 1 /Users/Shared/Epic Games/UE_5.2/Engine/Source/Runtime/Core/Public/Delegates/DelegateInstancesImpl.h
FILE 2 /Users/Shared/Epic Games/UE_5.2/Engine/Source/Runtime/Core/Public/Modules/ModuleManager.h
FILE 3 /Users/Shared/Epic Games/UE_5.2/Engine/Source/Runtime/Core/Public/Templates/Function.h
FILE 4 /Users/Shared/Epic Games/UE_5.2/Engine/Source/Runtime/CoreUObject/Public/UObject/Class.h
FILE 5 /Users/Shared/Epic Games/UE_5.2/Engine/Source/Runtime/CoreUObject/Public/UObject/Object.h
FILE 6 /Users/Shared/Epic Games/UE_5.2/Engine/Source/Runtime/CoreUObject/Public/UObject/UObjectBase.h
```

Thanks for using BugSplat!
