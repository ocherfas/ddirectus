import { Command } from "commander";

const program = new Command()
program
    .name('ddirectus')
    .description('CLI to import and export Directus object to and from yaml files')
    .version('0.0.1')

program.command('export')
    .description('Export objects')
    .argument

program.parse()
