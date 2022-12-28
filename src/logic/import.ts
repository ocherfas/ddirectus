import Directus from "../services/directus.js"
import jsYaml from "js-yaml"
import * as fs from 'fs/promises'
import { getType } from "../directusTypes/directusUrlDecorator.js"
import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import lodash from "lodash"
import { DirectusType } from "../types.js"
const {isEmpty} = lodash

async function importFlows(paths: string[], options: {url: string, token?: string}){
    const {url, token} = options
    const directus = new Directus(url, token)

    console.log(paths)

    const allObjects = await loadAllObjectsFromPaths(paths)
    validateAndConvertObjects(allObjects)
}

async function loadAllObjectsFromPaths(paths: string[]){
    const objects = await Promise.all(paths.map(loadObjectsFromFile))
    return objects.flat()
}

async function loadObjectsFromFile(filename: string){
    await fs.access(filename)
    const stat = await fs.lstat(filename)
    
    if (stat.isDirectory()){
        throw new Error(`Path is directory ${filename}`)
    }

    const buffer = await fs.readFile(filename)
    const fileContents = buffer.toString()
    return jsYaml.loadAll(fileContents) as DirectusType[]
}

async function validateAndConvertObjects(objects: DirectusType[]){
    return Promise.all(objects.map(validateAndConvertObject))
}

async function validateAndConvertObject(object: DirectusType){
    const {directusType: type, directusVersion: version} = object
    if(!type || !version){
        throw new Error(`Error reading object: object must declare directusType and directusVersion`)
    }

    const constructor = getType(type, version)
    if(!constructor){
        throw new Error(`directusType ${type} of directusVersion ${version} is not known`)
    }

    const classObject = plainToClass(constructor, object)
    const validationErrors = await validate(classObject)
    if (!isEmpty(validationErrors)){
        throw new Error(`Error validating object: ${validationErrors}`)
    }

    return classObject
}

export default importFlows