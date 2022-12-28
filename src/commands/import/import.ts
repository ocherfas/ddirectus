import { Command, Argument, Option } from "commander"
import importFlows from "../../logic/import.js"

const importCommand = new Command('import').description('Import objects to a Directus instance')

importCommand.addCommand(new Command('flows')
    .description('Import flows')
    .addArgument(new Argument('<IMPORT_PATHS...>', 'Glob pattern to include in the import'))
    .addOption(new Option('--token <value>', 'Token to authenticate with directus').env("DIRECTUS_TOKEN"))
    .addOption(new Option('--url <value>', 'Directus server URL').env("DIRECTUS_URL").makeOptionMandatory())
    .action(importFlows)
)

export default importCommand