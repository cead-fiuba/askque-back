import { HttpError } from "routing-controllers";

export class UserCreationError extends HttpError {
    message: string

    constructor(message: string) {
        super(404, message);

    }

    toJSON() {
        return {
            status: 404,
            code: "CREATION USER ERROR",
            message: this.message
        }
    }
}