import { Command } from "commander";
import exportCommand from "./src/commands/export/export.js";
import importCommand from "./src/commands/import/import.js";

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
        
    program.addCommand(exportCommand)
    program.addCommand(importCommand)

    program.parseAsync()
}

main()