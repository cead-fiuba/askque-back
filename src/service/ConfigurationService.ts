import { Configuration } from "../entity/Configuration"
import { SucessResult } from "../model/SucessResults";
import { ShallResult } from "../model/ShallResult";
import { Repository, getConnection } from "typeorm";
import { createLoggerWithModuleName } from "../config/logger"

const logger = createLoggerWithModuleName(module)

export class ConfigurationService {

    private config: Map<string, String>
    private configurationDao: Repository<Configuration>
    private static _instance: ConfigurationService;


    private constructor() {
        this.configurationDao = getConnection().getRepository(Configuration);
        this.config = new Map<string, String>();
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    async insertNewConfiguration(key: string, value: string): Promise<ShallResult> {
        const newConfiguration = new Configuration()
        newConfiguration.name = key
        newConfiguration.value = value
        const config: Configuration = await this.configurationDao.save(newConfiguration);
        this.config.set(config.name, config.value);
        logger.info(`Updated config ${JSON.stringify(this.config)}`)
        return new SucessResult(config);
    }


    async getBooleanValue(name: string): Promise<boolean> {
        const value = await this.getValue(name);
        logger.info(`Get boolean value of ${name} value=> ${value}`)
        return value == "true";
    }


    async getValue(name: string): Promise<String> {
        if (this.config.has(name)) {
            return Promise.resolve(this.config.get(name))
        } else {
            const conf = await this.configurationDao.findOne({ name: name });
            this.config.set(name, conf.value);
            return conf.value;
        }
    }

}


