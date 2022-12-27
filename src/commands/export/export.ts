import { Command, Argument, Option } from "commander"
import exportFlows from "../../logic/export.js"

const exportCommand = new Command('export').description('Export objects from a Directus instance')

exportCommand.addCommand(new Command('flows')
    .description('Export flows')
    .addArgument(new Argument('EXPORT_PATH', 'Path to export the objects to'))
    .addOption(new Option('--token <value>', 'Token to authenticate with directus').env("DIRECTUS_TOKEN"))
    .addOption(new Option('--url <value>', 'Directus server URL').env("DIRECTUS_URL").makeOptionMandatory())
    .action(exportFlows)
)

export default exportCommand