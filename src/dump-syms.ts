
import { constants } from 'node:buffer';
import child_process from 'node:child_process';
import { existsSync } from 'node:fs';
import { platform } from 'node:os';
import { dirname, join } from 'node:path';
import { execPath } from 'node:process';
import { promisify } from 'node:util';
const exec = promisify(child_process.exec);
const maxBuffer = constants.MAX_LENGTH

export class DumpSyms {
    private pathToDumpSyms: string;

    constructor(pathToDumpSyms?: string) {
        const os = platform();
        if (os === 'win32') {
            this.pathToDumpSyms = pathToDumpSyms ?? this.findDumpSyms('dump-syms-win.exe');
        } else if (os === 'darwin') {
            this.pathToDumpSyms = pathToDumpSyms ?? this.findDumpSyms('dump-syms-mac');
        } else {
            this.pathToDumpSyms = pathToDumpSyms ?? this.findDumpSyms('dump-syms-linux');
        }
    }

    async run(inputPath: string, outputPath?: string): Promise<{ stdout: string, stderr: string }> {
        const command = `${this.pathToDumpSyms} ${inputPath}` + (outputPath ? ` > ${outputPath}` : '');
        return exec(command, {
            maxBuffer
        });
    }

    private findDumpSyms(platformSpecificFileName: string): string {
        if (existsSync(platformSpecificFileName)) {
            return platformSpecificFileName;
        }

        let pathToDumpSyms = join('.', 'dist', 'bin', platformSpecificFileName);

        if (existsSync(pathToDumpSyms)) {
            return pathToDumpSyms;
        }

        pathToDumpSyms = join(dirname(execPath), platformSpecificFileName);

        if (existsSync(pathToDumpSyms)) {
            return pathToDumpSyms;
        }

        throw new Error(`Could not find dump-syms binary at ${pathToDumpSyms}!`);
    }
}
