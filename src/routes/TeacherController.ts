import { JsonController, Param, Body, Get, Post, Put } from "routing-controllers";
import { Repository, getConnection } from "typeorm";
import { Teacher } from "../entity/Teacher";
import { createLoggerWithModuleName } from "../config/logger"
import { TeacherService } from "../service/TeacherService";
import { ShallResult } from "../model/ShallResult";
import { UserCreationError } from "../error/UserCreationError";

const logger = createLoggerWithModuleName(module)

@JsonController()
export class TeacherController {

   teacherService: TeacherService

   constructor() {
      this.teacherService = new TeacherService();
   }


   @Post("/teachers")
   async post(@Body() user: Teacher) {
      logger.info("POST /teachers")
      try {
         const shallResult: ShallResult = await this.teacherService.createTeacher(user);
         if (shallResult.isSucess()) {
            logger.info('Creation teacher was sucess')
            return {
               code: "CREATION USER SUCESS",
               token: shallResult.getResult()
            }
         } else {
            logger.error('Creation teacher was failed')
            throw new UserCreationError(shallResult.getResult())
         }
      } catch (e) {
         throw e
      }


   }

   @Get("/teachers/:email")
   async get(@Param("email") teacherEmail: string) {
      logger.info(`Find teacher by email ${teacherEmail}`)
      return this.teacherService.findByEmail(teacherEmail)
   }
}