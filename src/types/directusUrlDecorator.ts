interface DirectusTypeOptions {
    url: string,
    version: string,
    typeName: string,
    exportPath: string
}

export default function DirectusType(options: DirectusTypeOptions){
    return <T extends { new (...args: any[]): {} }>(ctr: T) => {
        return class extends ctr {
            static url = options.url;
            static exportPath = options.exportPath

            type = options.typeName
            verson = options.version 
      
            constructor(...args: any[]) {
              super(...args);
            }
          };
    }
}