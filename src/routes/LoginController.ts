import { JsonController, Body, Post, NotFoundError } from "routing-controllers";
import { LoginRequestDTO } from "../dto/LoginRequestDTO";
import { LoginService } from "../service/LoginService";
import { LogginError } from "../error/LogginError";
import { createLoggerWithModuleName } from "../config/logger"
import { TeacherLoginRequestDTO } from "../dto/TeacherLoginRequestDTO";
import { LoginUserResponseDTO } from "../dto/LoginUserResponseDTO";

const logger = createLoggerWithModuleName(module)


@JsonController()
export class LoginController {


    loginService: LoginService

    constructor() {
        this.loginService = new LoginService();
    }

    @Post("/login/student")
    createStudentSession(@Body() request: LoginRequestDTO) {
        return this.loginService.createStudentSession(request).then((res: LoginUserResponseDTO) => {
            return res;
        }).catch((e) => {
            logger.error('Error found', e)
            throw new NotFoundError('Error in the login');
        })
    }

    @Post("/login/teacher")
    createTeacherSession(@Body() request: TeacherLoginRequestDTO) {
        return this.loginService.createTeacherSession(request).then((res: LoginUserResponseDTO) => {
            return res;
        }).catch((e) => {
            logger.error(`Error found creating session for ${request.email}`);
            throw new NotFoundError(`Error in the login ${e}`);
        })
    }

}