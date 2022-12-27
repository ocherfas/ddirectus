import fetch from "node-fetch";

export interface CollectionGetResponse{
    data: []
}

export interface FlowsGetReponse extends CollectionGetResponse {};
export interface OperationsGetResponse extends CollectionGetResponse {};

export default class Directus{
    token?: string;
    url: string;

    constructor(url: string, token?: string){
        this.token = token
        this.url = url
    }

    async getJson(path: string): Promise<any>{
        const requestUrl = new URL(path, this.url)
        
        const response = await fetch(requestUrl.toString(), {
            headers: this.token ? {
                'Authorization': `Bearer ${this.token}`
            } : {}
        })

        return response.json()
    }

    async postJson(path: string, collection: []): Promise<void>{
        const requestUrl = new URL(path, this.url)

        await fetch(requestUrl.toString(), {
            method: "POST",
            body: JSON.stringify(collection),
            headers: this.token ? {
                'Authorization': `Bearer ${this.token}`
            } : {}
        })
    }
}