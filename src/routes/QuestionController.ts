import { JsonController, Param, Body, Get, Post, Put, Delete, UseBefore, Header, HeaderParam } from "routing-controllers";
import { Repository, getConnection, DeleteResult, UpdateResult } from "typeorm";
import { Questionary } from '../entity/Questionary'
import { QuestionaryService } from "../service/QuestionaryService";
import { CacheMiddleware } from "../middleware/CacheMiddleware";
import { createLoggerWithModuleName } from "../config/logger"
import { performance } from "perf_hooks";
import { ShallResult } from "../model/ShallResult";
import { CreateQuestionaryRequestDTO } from "../dto/CreateQuestionaryRequestTO";
import { QuestionService } from "../service/QuestionService";


const logger = createLoggerWithModuleName(module)

@JsonController()
export class QuestionController {

   service: QuestionService

   constructor() {
      this.service = new QuestionService();
   }

   @Delete("/questions/:questionId")
   async deleteQuestionary(@Param("questionId") questionId: number, @HeaderParam('Authorization', { required: true }) token: string) {
      logger.info(`DELETE /questions/${questionId}`)
      try {
         const result: DeleteResult = await this.service.deleteQuestion(questionId)
         return {
            code: 'QUESTION DELETED',
            message: `The question of id ${questionId} was deleted`

         }
      } catch (e) {
         throw new Error('Cannot delete questionary, try more later')
      }
   }
}