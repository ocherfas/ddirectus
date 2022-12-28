import lodash from "lodash"
import { DirectusTypeOptions } from "../types.js"
const {get, set} = lodash

const typesMap: {[key: string]: {[key: string]: Constructor}} = {}

type Constructor = { new (...args: any[]): {} }

export function getType(typeName: string, version: string){
  return get(typesMap, [typeName, version], null)
}

export default function DirectusType(options: DirectusTypeOptions){
    if(get(typesMap, [options.typeName, options.version], null) != null){
      throw new Error(`Type ${options.typeName} with version ${options.version} is declared twice`)
    }

    return <T extends { new (...args: any[]): {} }>(ctr: T) => {

      set(typesMap, [options.typeName, options.version], ctr)

      return class extends ctr {
          static url = options.url;
          static exportPath = options.exportPath

          directusType = options.typeName
          directusVersion = options.version 
    
          constructor(...args: any[]) {
            super(...args);
          }
        };
    }
}