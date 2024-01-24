#! /usr/bin/env node
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { glob } from 'glob';
import { basename, dirname, join } from 'path';
import { DumpSyms } from '../src/dump-syms';
import { argDefinitions, usageDefinitions } from './command-line-definitions';

(async () => {
    let {
        files,
        directory,
        help,
    } = commandLineArgs(argDefinitions);

    if (help) {
        logHelpAndExit();
    }

    if (!files) {
        logMissingArgAndExit('files');
    }
    if (!directory) {
        logMissingArgAndExit('directory');
    }

    let returnCode = 0;

    try {
        const globPattern = `${normalizeDirectory(directory)}/${files}`;
        const binaryFilePaths = await glob(globPattern);

        if (!binaryFilePaths.length) {
            throw new Error(`Could not find any files to upload using glob ${globPattern}!`);
        }

        console.log(`Found files:\n ${binaryFilePaths.join('\n')}`);

        const dumpSyms = new DumpSyms();

        for (const file of binaryFilePaths) {
            const fileName = basename(file);
            const outputFile = join(dirname(file), `${fileName}.sym`);
            const outputFileName = basename(outputFile);

            console.log(`Dumping syms for ${fileName}...`);

            const { stderr } = await dumpSyms.run(file, outputFile);

            if (stderr) {
                console.error(stderr);
            }

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

function normalizeDirectory(directory: string): string {
    return directory.replace(/\\/g, '/');
}