import { JsonController, Post, Body, Param } from "routing-controllers";
import { createLoggerWithModuleName } from "../config/logger"
import { ConfigurationService } from "../service/ConfigurationService";
import { ShallResult } from "../model/ShallResult";


const logger = createLoggerWithModuleName(module)


@JsonController()
export class ConfigurationController {

    service: ConfigurationService

    constructor() {
        this.service = ConfigurationService.Instance
    }

    @Post("/configurations/:key/:value")
    async insertNewConfig(@Param("key") key: string, @Param("value") value: string) {
        logger.info(`POST /configuration/${key}/${value}`)
        const result: ShallResult = await this.service.insertNewConfiguration(key, value);
        if (result.isSucess()) {
            return {
                code: "CONFIGURATION_SAVED",
                result: result.getResult()
            };
        }
    }
}