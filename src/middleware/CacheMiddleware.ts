import { ExpressMiddlewareInterface } from "routing-controllers";
import { Request, Response } from "express";
import { QuestionaryService } from "../service/QuestionaryService";
import { Questionary } from "../entity/Questionary";
import { createLoggerWithModuleName } from "../config/logger"
import { performance } from "perf_hooks";
const logger = createLoggerWithModuleName(module)

export class CacheMiddleware implements ExpressMiddlewareInterface { // interface implementation is optional


    questionaryService: QuestionaryService
    values: Map<string, Questionary>

    constructor() {
        this.questionaryService = new QuestionaryService();
        this.values = new Map<string, Questionary>();
    }

    use(request: Request, response: Response, next?: (err?: any) => any): any {
        const hash = request.params.hash
        logger.info(`Cache Middleware, check request ${hash}`);
        const startTime = performance.now()
        const isNecessaryCaching = request.query.cache
        if (isNecessaryCaching) {
            logger.info('Is necessary caching')
            const hash = request.params.hash
            const cachedBody: Questionary = this.values.get(hash)
            if (cachedBody) {
                logger.info('I have the body')
                response.setHeader("Content-Type", "application/json");
                const endTime = performance.now()
                logger.info(`Time ${endTime - startTime} milliseconds to sendResponse`)
                response.send(cachedBody)
                /** doesn't call next*/
                return
            } else {
                logger.info('I dont have the questionary, saving ...');
                this.questionaryService.find(hash).then((questionary: Questionary) => {
                    this.values.set(hash, questionary);
                })
            }
        } else {
            logger.info('Is not necessary caching')
        }
        const endTime = performance.now()
        logger.info(`Time ${endTime - startTime} milliseconds`)
        next();
    }

}