import fetch from "node-fetch";
import { DirectusReponse, FlowPatchRequest, FlowPostRequest, FlowResponse, OperationPatchRequest, OperationPostRequset, OperationResponse } from "../types";

export interface CollectionGetResponse{
    data: []
}

export interface FlowsGetReponse extends CollectionGetResponse {};
export interface OperationsGetResponse extends CollectionGetResponse {};

class DirectusError extends Error{
    constructor(errors: {message: string}[]){
        super(errors.map(error => error.message).toString())
    }
}

export default class Directus{
    token?: string;
    url: string;

    constructor(url: string, token?: string){
        this.token = token
        this.url = url
    }

    async request(path: string, method: string, body?: any): Promise<any>{
        const requestUrl = new URL(path, this.url)
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }

        if(this.token){
            headers['Authorization'] = `Bearer ${this.token}`
        }

        const response = await fetch(requestUrl.toString(), {
            method: method,
            body: JSON.stringify(body),
            headers: headers
        })

        if(response.ok){
            return response.json()
        } else {
            const responseJson = await response.json()
            throw new DirectusError(responseJson.errors)
        }
    }

    async postFlow(flow: FlowPostRequest): Promise<DirectusReponse<FlowResponse>>{
        return this.request('flows', "POST", flow) as Promise<DirectusReponse<FlowResponse>>
    }

    async postOperation(operation: OperationPostRequset): Promise<DirectusReponse<OperationResponse>>{
        return this.request('operations', "POST", operation) as Promise<DirectusReponse<OperationResponse>>
    }

    async updateFlow(flow: FlowPatchRequest, flowId: string): Promise<void>{
        await this.request(`flows/${flowId}`, "PATCH", flow)
    }

    async updateOperation(operation: OperationPatchRequest, operationId: string): Promise<void>{
        await this.request(`operations/${operationId}`, "PATCH", operation)
    }
}