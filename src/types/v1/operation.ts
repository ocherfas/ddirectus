import { Expose } from "class-transformer";
import {IsString } from "class-validator";
import DirectusType from "../directusUrlDecorator.js";

@DirectusType({
    url: "operations",
    typeName: "operation",
    version: "v1",
    exportPath: "operations"
})
export default class OperationV1{
    @IsString()
    @Expose()
    name!: string

    @IsString()
    @Expose()
    key!: string

    @IsString()
    @Expose()
    type!: string
}