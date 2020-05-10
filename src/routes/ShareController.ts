


import { JsonController, Body, Post, HeaderParam } from "routing-controllers";
import { MakeCopyRequestDTO } from "../dto/MakeCopyRequestDTO";
import { ShareService } from "../service/ShareService";
import { createLoggerWithModuleName } from "../config/logger"


const logger = createLoggerWithModuleName(module)


/**
 * 
 * This service is for shared questionary, duplicate between users
 * 
 * 
*/
@JsonController()
export class ShareController {

    service: ShareService

    constructor() {
        this.service = new ShareService()
    }

    @Post("/copy")
    copyQuestionary(@Body() request: MakeCopyRequestDTO, @HeaderParam('Authorization', { required: true }) token: string) {
        logger.info(`Request to generate copy received of questionary ${request.questionary_hash}`)
        return this.service.copyQuestionary(request, token).then((_) => {
            return { message: `You shared the questionary with user ${request.user_email}` }
        })
    }


}