import { OptionDefinition as ArgDefinition } from "command-line-args";
import { OptionDefinition as UsageDefinition, Section } from "command-line-usage";

export type CommandLineDefinition = ArgDefinition & UsageDefinition;

export const argDefinitions: Array<CommandLineDefinition> = [
    {
        name: 'file',
        defaultOption: true,
        type: String,
        description: 'The file to convert'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print this usage guide.'
    },
    {
        name: 'database',
        alias: 'b',
        type: String,
        typeLabel: '{underline string}',
        description: 'The name of your BugSplat database associated with your Client ID and Client Secret pair. This value can also be provided via the BUGSPLAT_DATABASE environment variable.'
    },
    {
        name: 'clientId',
        alias: 'i',
        type: String,
        typeLabel: '{underline string}',
        description: 'An OAuth2 Client Credentials Client ID for the specified database. This value can also be provided via the BUGSPLAT_CLIENT_ID environment variable.',
    },
    {
        name: 'clientSecret',
        alias: 's',
        type: String,
        typeLabel: '{underline string}',
        description: 'An OAuth2 Client Credentials Client Secret for the specified database. This value can also be provided via the BUGSPLAT_CLIENT_SECRET environment variable.',
    },
];

export const usageDefinitions: Array<Section> = [
    {
        header: '@bugsplat/android-dump-syms',
        content: 'android-dump-syms contains a command line utility and a library to help you generate sym files from Android binaries via the BugSplat API.',
    },
    {
        header: 'Usage',
        optionList: argDefinitions
    },
    {
        content: [
            'The -i and -s arguments are not required if you set the environment variables BUGSPLAT_CLIENT_ID and BUGSPLAT_CLIENT_SECRET.'
        ]
    },
    {
        header: 'Example',
        content: [
            'android-dump-syms {italic path-to-binary-file} -d {italic your-bugsplat-database} -i {italic your-client-id} -s {italic your-client-secret}',
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