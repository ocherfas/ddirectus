import Directus from "../services/directus.js"
import jsYaml from "js-yaml"
import * as fs from 'fs/promises'
import { getType } from "../directusTypes/directusUrlDecorator.js"
import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import lodash from "lodash"
import { DirectusType, DirectusTypeMapValue } from "../types.js"
const {isEmpty, groupBy, mapValues} = lodash

async function importFlows(paths: string[], options: {url: string, token?: string}){
    const {url, token} = options
    const directus = new Directus(url, token)
    const allObjects = await loadAllObjectsFromPaths(paths)
    const objectsWithTypes = await validateAndConvertObjects(allObjects)
    
    const groupedObjectsWithTypes = groupBy(objectsWithTypes, objectWithType => objectWithType.typeMapValue.url)
    const groupedObjects = mapValues(groupedObjectsWithTypes, objectsWithTypes => objectsWithTypes.map(objectWithType => objectWithType.object))
    await Promise.all(Object.keys(groupedObjects).map(url => createObjects(directus, url, groupedObjects[url] as [])))
}

async function createObjects(directus: Directus, url: string, objects: []){
    const withoutRedundentKeys = objects.map((object: DirectusType) => {
        const {directusType, directusVersion, ...withoutRedudentKeys} = object
        return withoutRedudentKeys
    })
    await directus.postJson(url, withoutRedundentKeys)
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

    const typeMapValue = getType(type, version) 
    
    if(!typeMapValue){
        throw new Error(`directusType ${type} of directusVersion ${version} is not known`)
    }

    const classObject = plainToClass(typeMapValue.ctr, object) as object
    const validationErrors = await validate(classObject)
    if (!isEmpty(validationErrors)){
        throw new Error(`Error validating object: ${validationErrors}`)
    }

    return {object: classObject, typeMapValue}
}

export default importFlows