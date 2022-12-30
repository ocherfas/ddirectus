export interface Flow{
    name: string,
    icon: string,
    color: string | null,
    description: string,
    status: string,
    trigger: string,
    accountability: string,
    options: any,
    operation?: Operation
}

export interface FlowResponse extends Flow{
    id: string
}

export interface OperationResponse extends Operation{
    id: string
}

export interface DirectusReponse<T> {
    data: T
}

export interface Operation{
    name: string,
    key: string,
    type: string,
    position_x: number,
    position_y: number,
    options: any,
    resolve?: Operation,
    reject?: Operation
}

export type CreateOperation = Operation & {flow: string}

export type OperationPostRequset = Omit<CreateOperation, 'resolve' | 'reject'>

export type FlowPostRequest = Omit<Flow, 'operation'>

export type FlowPatchRequest = Partial<FlowPostRequest & {operation: string}>

export type OperationPatchRequest = Partial<Omit<OperationPostRequset, 'flow'>> & {reject?: string, resolve?: string}