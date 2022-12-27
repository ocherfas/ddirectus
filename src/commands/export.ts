import Directus from "../directus.js"

async function exportCommand(options: {url: string, token?: string}): Promise<void>{
    const {url, token} = options
    const directus = new Directus(url, token)
    const flows = await directus.getFlows()
    console.log(flows)
}

export default exportCommand