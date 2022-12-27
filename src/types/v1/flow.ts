import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import DirectusUrl from "../directusUrlDecorator.js";

@DirectusUrl({
    url: "flows",
    version: "v1",
    typeName: "flow",
    exportPath: "flows"
})
export default class FlowV1{
    @IsString()
    @Expose()
    name!: string
    
    @IsString()
    @Expose()
    icon!: string

    @IsOptional()
    @IsString()
    @Expose()
    color!: string

    @IsString()
    @Expose()
    description!: string
}