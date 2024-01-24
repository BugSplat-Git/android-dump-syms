
import child_process from 'node:child_process';
import { platform } from 'node:os';
import { promisify } from 'node:util';
import { constants } from 'node:buffer';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
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

        const pathToDumpSyms = join('.', 'dist', 'bin', platformSpecificFileName);

        if (!existsSync(pathToDumpSyms)) {
            throw new Error(`Could not find ${platformSpecificFileName}!`);
        }

        return pathToDumpSyms;
    }
}
