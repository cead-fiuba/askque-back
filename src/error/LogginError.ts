import { HttpError } from "routing-controllers";

export class LogginError extends HttpError {
    constructor() {
        super(404);
    }

    toJSON() {
        return {
            status: 404,
            message: 'Cannot loggin'
        }
    }
}