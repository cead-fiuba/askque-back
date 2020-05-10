import { JsonController, Body, Post, BadRequestError } from "routing-controllers";
import { StudentService } from "../service/StudentService";
import { CreateStudentRequestDTO } from "../dto/CreateStudentRequestDTO";
import { createLoggerWithModuleName } from "../config/logger"
import { LoginService } from "../service/LoginService";

const logger = createLoggerWithModuleName(module)

@JsonController()
export class StudentController {

    studentService: StudentService
    loginService: LoginService

    constructor() {
        this.studentService = new StudentService()
        this.loginService = new LoginService()
    }

    @Post("/students")
    createStudent(@Body() request: CreateStudentRequestDTO) {
        logger.info("POST /students")
        return this.studentService.createStudent(request).then((student) => {
            const token: string = this.loginService.createTokenByEmail(student.email)
            return { token: token }
        }).catch((reason: Error) => {
            logger.error(reason.name)
            throw new BadRequestError(reason.message)
        })
    }

}