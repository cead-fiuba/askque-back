import { JsonController, Post, Req, Res, UploadedFile, Middleware } from "routing-controllers";
import { createLoggerWithModuleName } from "../config/logger"
import { S3Service } from "../service/S3Service";
import { Request, Response } from "express";

const logger = createLoggerWithModuleName(module)


@JsonController()
export class ImageController {

    s3Service: S3Service
    constructor() {
        this.s3Service = new S3Service()
    }

    @Post("/images")
    uploadImage(@Req() request: Request, @Res() response: Response) {
        logger.info('POST /images')
        return this.s3Service.uploadImage(request, response).then((value) => {
            logger.info('Upload image success')
            return {
                'image_url': value
            }
        }).catch((err) => {
            return {
                'not_ok': err
            }
        })
    }

}