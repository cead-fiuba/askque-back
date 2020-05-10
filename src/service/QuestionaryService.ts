import { Questionary } from "../entity/Questionary";
import { Repository, getConnection, DeleteResult, UpdateResult } from "typeorm";
import { Teacher } from "../entity/Teacher";
import { PublishQuestionaryService } from "./PublishQuestionaryService";
import { TeacherService } from "./TeacherService";
import { createLoggerWithModuleName } from "../config/logger"
import { LoginService } from "./LoginService";
import { QuestionService } from "./QuestionService";
import { Question } from "../entity/Question";
import { AdminService } from "./AdminService";
import { SucessResult } from "../model/SucessResults";
import { ShallResult } from "../model/ShallResult";
import { FailedResult } from "../model/FailedResults";
import { CreateQuestionaryRequestDTO } from "../dto/CreateQuestionaryRequestTO";
import { QuestionTO } from "../dto/QuestionTO";
import { OptionTO } from "../dto/OptionTO";
import { Option } from "../entity/Option";


const logger = createLoggerWithModuleName(module)


export class QuestionaryService {

    private questionaryDao: Repository<Questionary>
    private teacherService: TeacherService
    private hashService: PublishQuestionaryService
    private loginService: LoginService
    private questionService: QuestionService
    private adminService: AdminService

    constructor() {
        this.questionaryDao = getConnection().getRepository(Questionary)
        this.hashService = new PublishQuestionaryService();
        this.loginService = new LoginService();
        this.teacherService = new TeacherService();
        this.questionService = new QuestionService();
        this.adminService = new AdminService();
    }

    async saveQuestionary(request: CreateQuestionaryRequestDTO, token: string): Promise<Questionary> {
        const email = this.loginService.getEmailOfToken(token)
        logger.info(`Save questionary for user ${email}`)
        const userPromise: Promise<Teacher> = this.teacherService.findByEmail(email)
        const questionaryPromise: Promise<Questionary> = this.createQuestionaryOfRequest(request);
        return Promise.all([userPromise, questionaryPromise]).then((value) => {
            const teacher = value[0]
            const questionary = value[1]
            questionary.teacher = teacher;
            questionary.teacher_name = teacher.name;
            questionary.user_name = this.getUserName(email)
            return this.questionaryDao.save(questionary)
        }).catch((reason: any) => {
            return Promise.reject(reason)
        })
    }

    async createNewQuestionary(questionary: Questionary): Promise<Questionary> {
        const hash: string = await this.hashService.getHashForQuestionary();
        logger.info(`New Hash crated ${hash}`)
        questionary.hash = hash;
        questionary.user_name = this.getUserName(questionary.teacher.email)
        return this.questionaryDao.save(questionary)
    }


    async createQuestionaryOfRequest(request: CreateQuestionaryRequestDTO): Promise<Questionary> {
        const newQuestionary = new Questionary()
        if (request.is_new !== false) {
            newQuestionary.date = new Date(Date.now());
            const hash: string = await this.hashService.getHashForQuestionary();
            newQuestionary.hash = hash;
        } else {
            newQuestionary.hash = request.hash;
        }
        const questions: Question[] = request.questions.map((question: QuestionTO) => {
            const newQuestion = new Question()
            newQuestion.has_image = question.has_image;
            if (question.has_image) {
                newQuestion.image_url = question.image_url
                newQuestion.has_image = true
            }
            newQuestion.text = question.text
            newQuestion.options = question.options.map((option: OptionTO) => {
                const newOption = new Option();
                newOption.text = option.text
                newOption.correct = option.correct
                return newOption;
            })
            return newQuestion;
        })
        newQuestionary.questions = questions;
        newQuestionary.name = request.name;
        newQuestionary.quantity_respones = 0;
        newQuestionary.time_in_minutes = request.time;
        newQuestionary.module = request.module;
        return newQuestionary;
    }

    find(questionaryHash: string): Promise<Questionary> {
        logger.info(`Find questionary ${questionaryHash}`)
        return this.questionaryDao.findOne(questionaryHash)
    }

    findQuestionaryWithTeacher(hash: string): Promise<Questionary> {
        logger.info(`Find questionary ${hash} with teacher relations`)
        return this.questionaryDao.findOne({ hash: hash }, { relations: ["teacher"] })
    }


    /**
     * Si el user es un admin se devuelve todas las encuetas, esto es para monitorear la aplicacion
     * Si el user es un docente no admin, se devuelve solo sus encuestas
    */
    async findQuestionariesByEmail(email: string): Promise<Questionary[]> {
        logger.info(`Find questionaries of user ${email}`)
        const isAdmin = await this.adminService.isAdmin(email)
        if (isAdmin) {
            logger.info(`Is admin return all`)
            return this.findAll();
        } else {
            const teacher = await this.teacherService.findByEmailWithQuestionaries(email);
            if (!teacher) {
                logger.error(`Teacher not found`)
            } else {
                logger.info(`Teacher found!!!`)
                logger.info(`Questionaries found ${teacher.createdQuestionaries != undefined ? teacher.createdQuestionaries.length : 0}`);
                return Promise.resolve(teacher.createdQuestionaries);
            }
        }
    }

    async findQuestionariesByToken(token: string): Promise<Questionary[]> {
        logger.info(`Find questionaries for token ${token}`)
        const email = this.loginService.getEmailOfToken(token)
        return this.findQuestionariesByEmail(email)
    }


    async getOptionsOfQuestionary(token: string, hash: string): Promise<Question[]> {
        const email = this.loginService.getEmailOfToken(token)
        const questionsPromise: Promise<Question[]> = this.questionService.getQuestionsOfQuestionaryWithOptions(hash)
        return questionsPromise.then((questions: Question[]) => {
            questions.forEach((question: Question) => {
                question.options
            })
            return questions;
        })
    }

    async deleteQuestionary(token: string, hash: string): Promise<ShallResult> {
        logger.info('Delete questionary')
        const email = this.loginService.getEmailOfToken(token)
        const questionary: Questionary = await this.findQuestionaryWithTeacher(hash)
        if (questionary) {
            logger.info(`Check ownership for questionary ${hash}`)
            /***The user that is trying delete questionary isn't owner */
            if (questionary.teacher.email != email) {
                logger.error('Cannot delete questionary for ownership')
                return Promise.reject('Ownership false')
            }
            const promiseDeleteQuestionary = this.questionaryDao.delete({ hash: hash })
            return Promise.all([promiseDeleteQuestionary]).then((value: [DeleteResult, DeleteResult]) => {
                return new SucessResult("The questionary and responses was deleted")
            })
        }
        return Promise.resolve(new FailedResult('Cannot find the questionary'))

    }

    async findAll(): Promise<Questionary[]> {
        return this.questionaryDao.find();
    }


    plusResponsesQuantityOfQuestionary(hash: string): Promise<UpdateResult> {
        return this.questionaryDao.increment({ hash: hash }, "quantity_respones", 1)
    }

    showResultOfQuestionary(hash: string): Promise<UpdateResult> {
        return this.questionaryDao.update({ hash: hash }, { can_show_result: true })
    }

    getUserName(email: string): string {
        return email.split("@")[0]
    }
}