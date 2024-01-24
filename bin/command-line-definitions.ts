import { OptionDefinition as ArgDefinition } from "command-line-args";
import { OptionDefinition as UsageDefinition, Section } from "command-line-usage";

export type CommandLineDefinition = ArgDefinition & UsageDefinition;

export const argDefinitions: Array<CommandLineDefinition> = [
    {
        name: 'files',
        alias: 'f',
        type: String,
        defaultOption: true,
        defaultValue: '**/*.so',
        typeLabel: '{underline string} (optional)',
        description: 'Glob pattern that specifies a set of android binary files to upload. Defaults to \'**/*.so\'',
    },
    {
        name: 'directory',
        alias: 'd',
        type: String,
        defaultValue: '.',
        typeLabel: '{underline string} (optional)',
        description: 'Path of the base directory used to search for symbol files. This value will be combined with the --files glob. Defaults to \'.\'',
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print this usage guide.'
    },
];

export const usageDefinitions: Array<Section> = [
    {
        header: '@bugsplat/android-dump-syms',
        content: 'android-dump-syms contains a command line utility and a library to help you generate sym files from Android binaries.',
    },
    {
        header: 'Usage',
        optionList: argDefinitions
    },
    {
        header: 'Example',
        content: [
            'android-dump-syms {italic glob-for-android-binary-files} -d {italic directory-to-search}',
        ]
    },
    {
        header: 'Links',
        content: 
        [
            '🐛 {underline https://bugsplat.com}',
            '',
            '💻 {underline https://github.com/BugSplat-Git/android-dump-syms}',
            '',
            '💌 {underline support@bugsplat.com}'
        ]
    }
];
