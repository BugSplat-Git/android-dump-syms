#! /usr/bin/env node
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import dotenv from 'dotenv';
import { glob } from 'glob';
import { basename, dirname, join } from 'path';
import { AndroidDumpSymsClient } from '../index';
import { argDefinitions, usageDefinitions } from './command-line-definitions';
import { writeFile } from './write';
dotenv.config();

(async () => {
    let {
        files,
        directory,
        help,
        database,
        clientId,
        clientSecret,
    } = commandLineArgs(argDefinitions);

    if (help) {
        logHelpAndExit();    
    }

    database = database ?? process.env.BUGSPLAT_DATABASE;
    clientId = clientId ?? process.env.BUGSPLAT_CLIENT_ID;
    clientSecret = clientSecret ?? process.env.BUGSPLAT_CLIENT_SECRET;
    
    if (!files) {
        logMissingArgAndExit('files');
    }
    if (!directory) {
        logMissingArgAndExit('directory');
    }
    if (!database) {
        logMissingArgAndExit('database');
    }
    if (!clientId || !clientSecret) {
        logMissingAuthAndExit();
    }
    
    let returnCode = 0;
    
    try {
        const globPattern = `${normalizeDirectory(directory)}/${files}`;
        const binaryFilePaths = await glob(globPattern);

        if (!binaryFilePaths.length) {
            throw new Error(`Could not find any files to upload using glob ${globPattern}!`);
        }

        console.log(`Found files:\n ${binaryFilePaths.join('\n')}`);

        const host = process.env.BUGSPLAT_HOST || `https://${database}.bugsplat.com`;
        
        console.log(`Authenticating with BugSplat via ${host}...`);
        
        const client = await AndroidDumpSymsClient.create(database, clientId, clientSecret, host);

        for (const file of binaryFilePaths) {
            const fileName = basename(file);

            console.log(`Uploading ${fileName}...`);
    
            const response = await client.upload(file);
    
            if (response.status !== 200) {
                console.error(`Could not convert file, status: ${response.status}`);
                returnCode = 1;
                continue;
            }

            console.log(`Uploaded ${fileName} successfully!`);
    
            const outputFile = join(dirname(file), `${fileName}.sym`);
            const outputFileName = basename(outputFile);
    
            console.log(`Downloading ${outputFileName}...`);
            
            await writeFile(outputFile, response.body as ReadableStream);
    
            console.log(`Successfully converted ${fileName} to ${outputFileName}`);
        }
    } catch (error) {
        console.error(error);
        returnCode = 1;
    }

    process.exit(returnCode);
})();

function logHelpAndExit() {
    const help = commandLineUsage(usageDefinitions);
    console.log(help);
    process.exit(1);
}

function logMissingArgAndExit(arg: string): void {
    console.log(`\nMissing argument: -${arg}\n`);
    process.exit(1);
}

function logMissingAuthAndExit(): void {
    console.log('\nInvalid authentication arguments: please provide a clientId and clientSecret\n');
    process.exit(1);
}

function normalizeDirectory(directory: string): string {
    return directory.replace(/\\/g, '/');
}