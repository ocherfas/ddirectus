export class DirectusError extends Error{
    constructor(errors: {message: string}[]){
        super(errors.map(error => error.message).toString())
    }
}