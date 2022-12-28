import Directus from "../services/directus.js"
import yaml from 'js-yaml'
import * as fs from 'fs-extra'
import path from "node:path"
import filenamify from "filenamify"
import { plainToInstance, ClassConstructor } from "class-transformer"
import FlowV1 from "../directusTypes/v1/flow.js"
import OperationV1 from "../directusTypes/v1/operation.js"

async function exportFlows(exportPath: string, options: {url: string, token?: string}): Promise<void>{
    const {url, token} = options
    const directus = new Directus(url, token)
    await Promise.all([
        exportToFiles(FlowV1, directus, exportPath),
        exportToFiles(OperationV1, directus, exportPath)
    ])
}

async function exportToFiles<T>(cls: ClassConstructor<T>, directus: Directus, baseExportPath: string): Promise<void>{
    //@ts-ignore
    const typeUrl = cls.url
    //@ts-ignore
    const typeExportPath = cls.exportPath

    const collection = await directus.getJson(typeUrl)
    
    await Promise.all(collection.data.map(async (element: any) => {
        const flowV1 = plainToInstance(cls, element, {excludeExtraneousValues: true})
        const flowYamlString = yaml.dump(flowV1)
        const fileName = filenamify(element.name.replaceAll(" ", "_"), {replacement: "_"})+'.yaml'
        const filePath = path.resolve(baseExportPath, typeExportPath, fileName)
        await fs.outputFile(filePath, flowYamlString)
    }));
}

export default exportFlows