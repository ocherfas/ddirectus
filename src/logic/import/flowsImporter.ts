import Directus from "../../services/directus";
import { CreateOperation, Flow, OperationPostRequset } from "../../types";

export class FlowImporter{
    directus: Directus;
    
    constructor(directus: Directus){
        this.directus = directus
    }

    async createFlow(flow: Flow){
        const {operation, ...flowWithoutOperation} = flow
        const createdFlow = await this.directus.postFlow(flowWithoutOperation)
        if(operation){
            const createdFlowId = createdFlow.data.id
            const request: CreateOperation = {...operation, flow: createdFlowId} 
            const createdOperationId = await this.createOperation(request)
            await this.directus.updateFlow({operation: createdOperationId}, createdFlowId)
        }
    }

    async createOperation(operation: CreateOperation): Promise<string>{
        const {reject, resolve, ...restOfOperation} = operation
        const flowId = operation.flow
        const createdOperation = await this.directus.postOperation(restOfOperation)
        const createdOperationId = createdOperation.data.id

        let createdResolveOperationId = undefined
        let createdRejectOperationId = undefined
        if(resolve){
            const resolveRequest:OperationPostRequset = {...resolve, flow: flowId} 
            createdResolveOperationId = await this.createOperation(resolveRequest)
        }
        if(reject){
            const rejectRequset:OperationPostRequset = {...reject, flow: flowId} 
            createdRejectOperationId = await this.createOperation(rejectRequset)
        }

        if(resolve || reject){
            await this.directus.updateOperation({reject:createdRejectOperationId, resolve: createdResolveOperationId}, createdOperationId)
        }

        return createdOperationId
    }
}