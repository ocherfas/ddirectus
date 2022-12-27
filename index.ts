import { Command, Option } from "commander";
import exportCommand from "./src/commands/export.js";

async function main(){
    if(process.env.NODE_ENV == 'development'){
        const dotenv = await import('dotenv')
        dotenv.config()
    }

    const program = new Command()
    program
        .name('ddirectus')
        .description('CLI to import and export Directus object to and from yaml files')
        .version('0.0.1')

    program.command('export')
        .description('Export objects')
        .addOption(new Option('--token <value>', 'Token to authenticate with directus').env("DIRECTUS_TOKEN"))
        .addOption(new Option('--url <value>', 'Directus server URL').env("DIRECTUS_URL").makeOptionMandatory())
        .action(exportCommand)

    program.parseAsync()
}

main()