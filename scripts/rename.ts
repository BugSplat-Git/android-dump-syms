#! /usr/bin/env node
import { platform } from "os";
import { rename } from 'node:fs/promises';
import { join } from "node:path";

(async () => {
    const os = platform();
    const bin = join('dist', 'bin');
    const oldPath = os === 'win32' ? join(bin, 'dump_syms.exe') : join(bin, 'dump_syms');
    
    if (os === 'win32') {
        const newPath = join(bin, 'dump-syms-win.exe');
        await rename(oldPath, newPath);
    } else if (os === 'darwin') {
        const newPath = join(bin, 'dump-syms-mac');
        await rename(oldPath, newPath);
    } else {
        const newPath = join(bin, 'dump-syms-linux');
        await rename(oldPath, newPath);
    }
})();