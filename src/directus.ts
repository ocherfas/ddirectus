import fetch from "node-fetch";

export default class Directus{
    token?: string;
    url: string;

    constructor(url: string, token?: string){
        this.token = token
        this.url = url
    }

    async getFlows(): Promise<any>{
        const requestUrl = new URL('flows', this.url)
        
        const response = await fetch(requestUrl.toString(), {
            headers: this.token ? {
                'Authorization': `Bearer ${this.token}`
            } : {}
        })

        const json = await response.json()
        return json
    }
}