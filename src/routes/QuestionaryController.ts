import { JsonController, Param, Body, Get, Post, Put, Delete, UseBefore, Header, HeaderParam } from "routing-controllers";
import { Repository, getConnection, DeleteResult, UpdateResult } from "typeorm";
import { Questionary } from '../entity/Questionary'
import { QuestionaryService } from "../service/QuestionaryService";
import { CacheMiddleware } from "../middleware/CacheMiddleware";
import { createLoggerWithModuleName } from "../config/logger"
import { performance } from "perf_hooks";
import { ShallResult } from "../model/ShallResult";
import { CreateQuestionaryRequestDTO } from "../dto/CreateQuestionaryRequestTO";


const logger = createLoggerWithModuleName(module)

@JsonController()
export class QuestionaryController {

   questionaryDao: Repository<Questionary>
   service: QuestionaryService

   constructor() {
      this.questionaryDao = getConnection().getRepository(Questionary)
      this.service = new QuestionaryService();
   }

   @Get("/questionaries/:hash")
   @UseBefore(CacheMiddleware)
   getOne(@Param("hash") hash: string) {
      logger.info(`GET /questionaries/${hash}`)
      const startTime = performance.now()
      const questionaryPromise: Promise<Questionary> = this.questionaryDao.findOne({ hash })
      const endTime = performance.now()
      logger.info(`Time ${endTime - startTime} miliseconds`)
      return questionaryPromise;
   }

   @Post("/questionaries")
   post(@Body() questionary: CreateQuestionaryRequestDTO, @HeaderParam('Authorization', { required: true }) token: string) {
      return this.service.saveQuestionary(questionary, token)
         .then((value: Questionary) => {
            return {
               code: "QUESTIONARY SAVED",
               hash: value.hash,
               date: value.date
            }
         })
   }


   /**
    * 
    * Se obtiene todos los cuestionarios del usuario. Para identificar el usuario se usa el token
    * de Authorization.
   */
   @Get("/questionaries")
   async getQuestionariesFromUser(@HeaderParam('Authorization', { required: true }) token: string) {
      logger.info('GET /questionaries')
      const questionaries: Questionary[] = await this.service.findQuestionariesByToken(token)
      if (questionaries) {
         return {
            questionaries: questionaries
         }
      } else {
         throw new Error('Error in found questionaries')
      }
   }

   @Delete("/questionaries/:hash")
   async deleteQuestionary(@Param("hash") hash: string, @HeaderParam('Authorization', { required: true }) token: string) {
      logger.info(`DELETE /questionaries/${hash}`)
      try {
         const result: ShallResult = await this.service.deleteQuestionary(token, hash)
         if (result.isSucess()) {
            return {
               code: 'QUESTIONARY DELETED',
               message: `The questionary ${hash} was deleted and the responses too`
            }
         } else {
            throw new Error(result.getResult())
         }
      } catch (e) {
         throw new Error('Cannot delete questionary, try more later')
      }
   }

   @Put("/questionaries/:hash/increment")
   async incrementQuantityResponsesOfQuestionary(@Param("hash") hash: string) {
      try {
         const result: UpdateResult = await this.service.plusResponsesQuantityOfQuestionary(hash)
         return {
            code: "UPDATE_QUESTIONARY",
            message: `The questionary ${hash} was updated`
         }
      } catch (e) {
         throw new Error("Update error")
      }
   }

   @Put("/questionaries/:hash/show_results")
   async showResults(@Param("hash") hash: string) {
      return this.service.showResultOfQuestionary(hash).then((res) => {
         return {
            code: "OK",
            message: `The questionary ${hash} was updated`
         }
      })
   }

}