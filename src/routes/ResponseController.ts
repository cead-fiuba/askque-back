import { JsonController, Param, Body, Get, Post, Req, Delete, HeaderParam, QueryParams, QueryParam } from "routing-controllers";
import { ResponseService } from "../service/ResponseService";
import { ResponseDTO } from "../dto/ResponseDTO";
import { Request } from "express";
import { createLoggerWithModuleName } from "../config/logger"
import { performance } from "perf_hooks";
import { ResponseUserRequestTO } from "../dto/ResponseUserRequestTO";



const logger = createLoggerWithModuleName(module)

@JsonController()
export class ResponseController {

    responseService: ResponseService

    constructor() {
        this.responseService = new ResponseService()
    }

    @Post("/responses")
    post(@Body() response: ResponseDTO, @HeaderParam('Authorization', { required: true }) token: string) {
        logger.info('POST /responses')
        this.responseService.saveQuestionaryResponse(response, token)
        return { "message": "response was saved" }
    }

    @Delete("/responses/questionaries/:questionaryHash")
    async deleteResponseOfQuestionary(@Param("questionaryHash") hash: string) {
        try {
            const resul = await this.responseService.deleteResponseOfQuestionary(hash);
            return {
                code: "RESPONSES_DELETED",
                message: `The responses of ${hash} was deleted`
            };
        }
        catch (reason) {
            throw new Error('Cannot delete responses');
        }
    }

    @Get("/responses")
    async getResponseOfUser(@HeaderParam('Authorization', { required: true }) token: string,
        @QueryParam("with_answers") withAnswers: boolean,
        @QueryParam("questionary_hash") questionaryHash: string,
        @QueryParam("process") process: boolean) {
        try {
            const result = await this.responseService.getResponsesOfStudent(token, withAnswers, questionaryHash, process)
            logger.info(`responses founded!`)
            return {
                answers: result
            }
        } catch (reason) {
            logger.error('Cannot get responses')
            throw new Error('Cannot get responses')
        }

    }


}