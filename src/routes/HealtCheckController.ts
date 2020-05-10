import { JsonController, Get } from "routing-controllers";
import { LoginService } from "../service/LoginService";
import { createLoggerWithModuleName } from "../config/logger"

const logger = createLoggerWithModuleName(module)


@JsonController()
export class HealtCheckController {

    constructor() {
    }

    @Get("/")
    createStudentSession() {
        logger.info('HealtCheck received')
        return {
            status: "The app is UP"
        }
    }

}