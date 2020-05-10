import { Questionary } from "../entity/Questionary";
import { Repository, getConnection, DeleteResult } from "typeorm";
import { Teacher } from "../entity/Teacher";
import { createLoggerWithModuleName } from "../config/logger"
import { Question } from "../entity/Question";
import { OptionService } from "./OptionService";


const logger = createLoggerWithModuleName(module)


export class QuestionService {

    private questionDao: Repository<Question>
    private optionService: OptionService

    constructor() {
        this.questionDao = getConnection().getRepository(Question)
        this.optionService = new OptionService();
    }

    getQuestionsOfQuestionaryWithOptions(hash: string): Promise<Question[]> {
        logger.info(`Get questions of ${hash}`)
        return this.questionDao.find({ where: { questionaryHash: hash } });
    }

    saveQuestion(question: Question): Promise<Question> {
        return this.questionDao.save(question)
    }

    deleteQuestion(questionId: number): Promise<DeleteResult> {
        return this.questionDao.delete({ id: questionId })
    }

}