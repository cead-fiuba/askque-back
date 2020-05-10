import { MakeCopyRequestDTO } from "../dto/MakeCopyRequestDTO";
import { QuestionaryService } from "./QuestionaryService";
import { Questionary } from "../entity/Questionary";
import { Teacher } from "../entity/Teacher";
import { UserService } from "./UserService";
import { LoginService } from "./LoginService";
import { createLoggerWithModuleName } from "../config/logger"


const logger = createLoggerWithModuleName(module)


export class ShareService {

    private questionaryService: QuestionaryService
    private userService: UserService
    private loginService: LoginService

    constructor() {
        this.questionaryService = new QuestionaryService()
        this.userService = new UserService()
        this.loginService = new LoginService();
    }

    async copyQuestionary(request: MakeCopyRequestDTO, token: string): Promise<Questionary> {
        logger.info(`Generating copy for questionary ${request.questionary_hash}`)
        const questionaryPromise: Promise<Questionary> = this.questionaryService.find(request.questionary_hash)
        const email = request.with_me ? this.loginService.getEmailOfToken(token) : request.user_email;
        logger.info(`Email found ${email}`)
        if (!email) {
            throw new Error('Invalid email')
        }
        logger.info(`Generating copy for user ${email}`)
        const userPromise: Promise<Teacher> = this.userService.findByEmail(email)

        return Promise.all([questionaryPromise, userPromise]).then((values) => {
            const questionary: Questionary = values[0]
            const user: Teacher = values[1]
            questionary.hash = ""
            questionary.questions.forEach(q => {
                delete q.id
                q.options.forEach(a => {
                    delete a.id
                })
            })
            questionary.teacher = user;
            questionary.quantity_respones = 0
            questionary.responses = []
            logger.info(`Clean questionary finished, saving...`)
            return this.questionaryService.createNewQuestionary(questionary);
        })
    }
}