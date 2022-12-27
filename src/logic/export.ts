import Directus, { CollectionGetResponse } from "../services/directus.js"
import yaml from 'js-yaml'
import * as fs from 'fs-extra'
import path from "node:path"
import filenamify from "filenamify"

async function exportFlows(exportPath: string, options: {url: string, token?: string}): Promise<void>{
    const {url, token} = options
    const directus = new Directus(url, token)
    
    const flowsPath = path.resolve(exportPath, 'flows')
    const operationsPath = path.resolve(exportPath, 'operations')

    await Promise.all([
        exportToFiles(flowsPath, directus.getFlows()),
        exportToFiles(operationsPath, directus.getOperations())
    ])
}

async function exportToFiles(exportPath: string, getCollectionPromise: Promise<CollectionGetResponse>): Promise<void>{
    const collection = await getCollectionPromise
    
    await Promise.all(collection.data.map(async (element: any) => {
        const flowYamlString = yaml.dump(element)
        const fileName = filenamify(element.name.replaceAll(" ", "_"), {replacement: "_"})+'.yaml'
        const filePath = path.resolve(exportPath, fileName)
        await fs.outputFile(filePath, flowYamlString)
    }));
}

export default exportFlows