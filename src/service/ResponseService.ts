import { ResponseDTO } from "../dto/ResponseDTO";
import { Response } from "../entity/Response";
import { Repository, getConnection, DeleteResult } from "typeorm";
import { createLoggerWithModuleName } from "../config/logger"
import { QuestionaryService } from "./QuestionaryService";
import { ResponseUserRequestTO } from "../dto/ResponseUserRequestTO";
import { QuestionResponse } from "../entity/QuestionResponse";
import { QuestionResponseDTO } from "../dto/QuestionResponseDTO";
import { LoginService } from "./LoginService";
import { Questionary } from "../entity/Questionary";
import { Student } from "../entity/Student";
import { TeacherService } from "./TeacherService";
import { Teacher } from "../entity/Teacher";
import { stringLiteral } from "@babel/types";
import { response } from "express";


const logger = createLoggerWithModuleName(module)


export class ResponseService {

    private responseDao: Repository<Response>
    private loginService: LoginService
    private teacherService: TeacherService

    constructor() {
        this.responseDao = getConnection().getRepository(Response)
        this.loginService = new LoginService();
        this.teacherService = new TeacherService();
    }

    async saveQuestionaryResponse(res: ResponseDTO, token: string) {
        logger.info(`Save response for  ${res.questionaryHash}`)
        const response = new Response()
        const student = new Student()
        const userEmail = this.loginService.getEmailOfToken(token);
        student.email = userEmail;
        response.student = student;
        const question_responses: QuestionResponse[] = new Array(res.responses.length);
        const questionary = new Questionary();
        questionary.hash = res.questionaryHash
        response.questionary = questionary;
        response.date = new Date(Date.now());
        const option_ids_by_question_id: Map<number, number[]> = new Map();
        res.responses.forEach((value: QuestionResponseDTO) => {
            if (option_ids_by_question_id.has(value.questionId)) {
                const currentValue: number[] = option_ids_by_question_id.get(value.questionId)
                currentValue.push(value.optionId)
                option_ids_by_question_id.set(value.questionId, currentValue);
            } else {
                option_ids_by_question_id.set(value.questionId, [value.optionId]);
            }
        })
        option_ids_by_question_id.forEach((optionIds: number[], questionId: number) => {
            logger.info(`Creating questionResponse for ${optionIds} and questionId ${questionId}`)
            const question_response = new QuestionResponse()
            question_response.questionId = questionId;
            question_response.optionIds = optionIds
            question_responses.push(question_response)
        })

        response.question_responses = question_responses;
        this.responseDao.save(response);

    }

    getResponseOfQuestionaryIdV2(questionaryId: string) {
        logger.info(`Get responses of questionary ${questionaryId}`)
        return this.responseDao
            .createQueryBuilder("response")
            .select("response.optionId AS optionId")
            .addSelect("response.questionId AS questionId")
            .addSelect("COUNT(*) as count")
            .where("response.questionaryHash =:hash", { hash: questionaryId })
            .groupBy("response.optionId")
            .addGroupBy("response.questionId")
            .getRawMany()
    }

    deleteResponseOfQuestionary(questionaryHash: string): Promise<DeleteResult> {
        logger.info(`Deleting responses of questionary ${questionaryHash}`)
        return this.responseDao
            .createQueryBuilder()
            .delete()
            .from(Response)
            .where("questionaryHash = :id", { id: questionaryHash })
            .execute();
    }


    async getResponsesOfStudent(token: string, withAnswers: boolean, questionaryHash: string, process: boolean): Promise<any> {
        const userEmail = this.loginService.getEmailOfToken(token);
        const teacher: Teacher = await this.teacherService.findByEmail(userEmail);
        if (teacher) {
            return this.getResponsesForTeacher(questionaryHash, process);
        } else {
            return this.getResponsesForStudent(userEmail, withAnswers, questionaryHash)
        }

    }


    async getResponsesForTeacher(questionaryHash: string, process: boolean): Promise<any> {
        logger.info(`Find response for questionaryHash ${questionaryHash} and process ${process}`)
        const responses: Response[] = await this.responseDao.find({ where: { questionary: questionaryHash }, relations: ['question_responses'] })
        if (!process) {
            return responses;
        } else {
            const quantityByOptionId: Map<number, number> = new Map<number, number>();
            responses.forEach((response: Response) => {
                const answerQuestions: QuestionResponse[] = response.question_responses;
                answerQuestions.forEach((answerQuestion: QuestionResponse) => {
                    const optionsIds: number[] = answerQuestion.optionIds;
                    optionsIds.forEach((optionId: number) => {
                        if (quantityByOptionId.has(optionId)) {
                            const currentValue = quantityByOptionId.get(optionId)
                            quantityByOptionId.set(optionId, currentValue + 1)
                        } else {
                            quantityByOptionId.set(optionId, 1)
                        }
                    })
                })
            })
            return quantityByOptionId;
        }
    }


    getResponsesForStudent(studentEmail: string, withAnswers: boolean, questionaryHash: string): Promise<Response[]> {
        if (withAnswers) {
            logger.info('Load with answers')
        }
        if (questionaryHash) {
            logger.info(`Find response for userEmail ${studentEmail} and questionary ${questionaryHash}`)
        }
        const whereCondition = questionaryHash ? { student: studentEmail, questionary: questionaryHash } : { student: studentEmail };
        const relationToLoad = withAnswers ? ['questionary', 'question_responses'] : ['questionary'];
        return this.responseDao.find({ where: whereCondition, relations: relationToLoad })
    }
}