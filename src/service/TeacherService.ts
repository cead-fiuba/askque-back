import { Teacher } from "../entity/Teacher";
import { Repository, getConnection } from "typeorm";
import { createLoggerWithModuleName } from "../config/logger"
import { LoginService } from "./LoginService";
import { SucessResult } from "../model/SucessResults";
import { FailedResult } from "../model/FailedResults";
import { ShallResult } from "../model/ShallResult";
import { ConfigurationService } from "./ConfigurationService";
import { APPLY_VALIDATION_EMAIL_KEY } from "../config/ConfigurationKeys";



const logger = createLoggerWithModuleName(module)

export class TeacherService {

    teacherDao: Repository<Teacher>
    loginService: LoginService
    configurationService: ConfigurationService

    constructor() {
        this.teacherDao = getConnection().getRepository(Teacher);
        this.loginService = new LoginService()
        this.configurationService = ConfigurationService.Instance
    }



    findByEmail = (email: string): Promise<Teacher> => {
        logger.info(`Find teacher by email ${email}`)
        return this.teacherDao.findOne({ email: email })
    }

    createTeacher = async (teacher: Teacher): Promise<ShallResult> => {
        const applyValitation = await this.configurationService.getBooleanValue(APPLY_VALIDATION_EMAIL_KEY)
        logger.info(`Apply validation ${applyValitation}`)
        if (applyValitation && !teacher.email.endsWith("fi.uba.ar")) {
            logger.error('The email not finished with fi.uba.ar')
            return Promise.resolve(new FailedResult("Invalid email"))
        }

        const alreadyExits = await this.checkIfTeacherAlreadyExists(teacher.email)
        if (alreadyExits) {
            return Promise.resolve(new FailedResult("A teacher already exits with that email"))
        }
        return this.teacherDao.save(teacher).then((response) => {
            logger.info(`create teacher success for ${response.email}`)
            const token = this.loginService.createTokenByEmail(teacher.email)
            return Promise.resolve(new SucessResult(token))

        }).catch((e) => {
            return Promise.reject(e)
        })
    }

    checkIfTeacherAlreadyExists = (teacherEmail: string): Promise<boolean> => {
        return this.findByEmail(teacherEmail).then((teacher) => {
            logger.info(`Teacher ${teacher}`)
            return teacher != undefined
        }).catch((reason) => {
            throw reason;
        })
    }


    findByEmailWithQuestionaries = (email: string): Promise<Teacher> => {
        logger.info(`Find teacher by email and questionaries ${email}`)
        return this.teacherDao.findOne({ where: { email: email }, relations: ["createdQuestionaries"] })
    }

} 