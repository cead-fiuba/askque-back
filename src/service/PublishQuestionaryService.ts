import { Repository, getConnection } from "typeorm";
import { Questionary } from "../entity/Questionary";
const randomstring = require("randomstring");
import { createLoggerWithModuleName } from "../config/logger"
const logger = createLoggerWithModuleName(module)


export class PublishQuestionaryService {

    private questionaryDao: Repository<Questionary>

    constructor() {
        this.questionaryDao = getConnection().getRepository(Questionary)
    }

    async getHashForQuestionary(): Promise<string> {
        logger.info('Create hash to publish questionary');
        let hash = this.createHash()
        let questionary: Questionary = await this.questionaryDao.findOne({ hash: hash });
        /** the hash is used */
        while (questionary) {
            hash = this.createHash()
            questionary = await this.questionaryDao.findOne({ hash: hash })
        }
        return hash;
    }


    getQuestionaryOfHash(hash: string) {
        console.log('getCuestionary');
        return this.questionaryDao.findOne({ hash: hash });
    }



    createHash() {
        console.log('Creating hash...');
        return randomstring.generate({
            length: 3,
            capitalization: 'uppercase'
        })
    }

}