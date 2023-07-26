#! /usr/bin/env node
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { stat } from 'fs/promises';
import path, { basename } from 'path';
import { AndroidDumpSymClient } from '../index';
import { argDefinitions, usageDefinitions } from './command-line-definitions';
import { writeFile } from './write-file';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
    let {
        file,
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
    
    const exists = await fileExists(file)
    
    if (!exists) {
        logMissingArgAndExit('file');
    }
    if (!database) {
        logMissingArgAndExit('database');
    }
    if (!clientId || !clientSecret) {
        logMissingAuthAndExit();
    }

    let returnCode = 0;
    
    try {
        const host = process.env.BUGSPLAT_HOST || `https://${database}.bugsplat.com`;
        
        console.log(`Authenticating with BugSplat via ${host}...`);
        
        const client = await AndroidDumpSymClient.create(clientId, clientSecret, host);

        console.log(`About to upload ${file}...`);

        const response = await client.upload(file);
        const status = response.status;

        if (status !== 200) {
            throw new Error(`Could not convert file, status: ${status}`)
        }

        const ext = path.extname(file);
        const fileName = path.basename(file, ext);
        const outputDir = path.dirname(file);
        const outputFile = path.join(outputDir, `${fileName}.sym`);

        console.log(`Downloading ${basename(outputFile)}...`);
        
        await writeFile(outputFile, response.body as ReadableStream);

        console.log(`Successfully converted ${basename(file)} to ${basename(outputFile)}`);
    } catch (error) {
        console.error(error);
        returnCode = 1;
    }

    process.exit(returnCode);
})();


async function fileExists(path: string): Promise<boolean> {
    try {
        return !!(await stat(path));
    } catch {
        return false;
    }
}

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
