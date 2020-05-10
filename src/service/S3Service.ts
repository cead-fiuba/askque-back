import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { createLoggerWithModuleName } from "../config/logger"
import { Request, Response } from 'express';
import { performance } from "perf_hooks";
const logger = createLoggerWithModuleName(module)
import enviromentConfiguration from '../config/envConfig'

aws.config.update({
    secretAccessKey: enviromentConfiguration.awsSecretKey,
    accessKeyId: enviromentConfiguration.awsAccessKeyId,
    region: enviromentConfiguration.awsRegion,
})

const s3 = new aws.S3()

export class S3Service {


    constructor() {
    }

    uploadImage(request: Request, response: Response) {
        logger.info('Uploading image ....')
        const startTime = performance.now()
        return new Promise((resolve, rejected) => {
            this.upload(request, response, (err) => {
                const endTime = performance.now()
                logger.info(`Time ${endTime - startTime} milliseconds`)
                if (err) {
                    logger.error("An error happened when try upload image ", err)
                    rejected(err)
                } else {
                    resolve(request.file.location)
                }
            })
        })
    }

    fileFilter(request: Request, file: any, cb: any) {
        logger.info(`Check image format ${file.mimetype}`)
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(new Error('Invalid image format, only JPEG and PNG'), false)
        }
    }

    upload = multer({
        fileFilter: this.fileFilter,
        storage: multerS3({
            s3: s3,
            acl: 'public-read',
            bucket: enviromentConfiguration.awsBucket,
            metadata: function (req: Request, file: any, cb: any) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req: Request, file: any, cb: any) {
                cb(null, Date.now().toString())
            }
        })
    }).single('image');
}


