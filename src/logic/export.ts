import Directus from "../services/directus.js"

async function exportFlows(exportPath: string, options: {url: string, token?: string}): Promise<void>{
    const {url, token} = options
    const directus = new Directus(url, token)
    const flows = await directus.getFlows()
    console.log(flows)
}

export default exportFlows