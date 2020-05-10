import { StudentService } from "../service/StudentService";
import { LoginRequestDTO } from "../dto/LoginRequestDTO";
import { createLoggerWithModuleName } from "../config/logger"
import { LogginError } from "../error/LogginError";
import jwt from 'jsonwebtoken'
import { NotFoundError } from "routing-controllers";
import { TeacherLoginRequestDTO } from "../dto/TeacherLoginRequestDTO";
import { TeacherService } from "./TeacherService";
import { LoginUserResponseDTO } from "../dto/LoginUserResponseDTO";

const logger = createLoggerWithModuleName(module)

export class LoginService {


    private studentService: StudentService

    constructor() {
        this.studentService = new StudentService();
    }


    async createTeacherSession(request: TeacherLoginRequestDTO): Promise<LoginUserResponseDTO> {
        logger.info(`Login sucess for teacher!! ${request.email}`)
        const token = this.createTokenByEmail(request.email)
        const response = new LoginUserResponseDTO(token, request.email, true)
        return Promise.resolve(response)
    }

    async createStudentSession(request: LoginRequestDTO): Promise<LoginUserResponseDTO> {
        const student = await this.studentService.findByEmail(request.email)
        if (!student || student.password !== request.password) {
            logger.error('Student not found or password is wrong')
            throw new NotFoundError()
        }
        logger.info(`Login success for student ${request.email}!`)
        const token = this.createTokenByEmail(request.email)
        const response = new LoginUserResponseDTO(token, request.email, false)
        return Promise.resolve(response)
    }

    createTokenByEmail(email: string): string {
        logger.info(`Create token for email ${email}`)
        const payload = {
            email: email
        }
        const token: string = jwt.sign(payload, 'Secret Password', {
            expiresIn: 60 * 60 * 24 * 30,
            algorithm: 'HS256'
        })
        logger.info('Token created!')
        return token;
    }

    validateTokenStudent(token: string): Promise<boolean> {
        token = token.replace('Bearer', '')
        const decoded: any = jwt.verify(token, 'Secret Password')
        return this.studentService.findByEmail(decoded.payload.email).then((student) => {
            return true;
        }).catch((e) => {
            return false;
        })
    }

    getEmailOfToken(token: string): string {
        logger.debug(`Get email of token ${token}`)
        token = token.replace('Bearer', '')
        try {
            const decodedToken: any = jwt.verify(token, 'Secret Password')
            logger.info(`Decoded token ${decodedToken}`)
            console.log('dsds', decodedToken)
            const email = decodedToken.email
            logger.info(`Email found ${email}`)
            return email
        } catch (err) {
            logger.error(`Error!!  Cannot decode ${err}`)
            throw new Error('Cannot decode')
        }

    }


}