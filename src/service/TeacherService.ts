import { Teacher } from "../entity/Teacher";
import { Repository, getConnection } from "typeorm";
import { createLoggerWithModuleName } from "../config/logger";
import { LoginService } from "./LoginService";
import { SucessResult } from "../model/SucessResults";
import { FailedResult } from "../model/FailedResults";
import { ShallResult } from "../model/ShallResult";
import { ConfigurationService } from "./ConfigurationService";
import { APPLY_VALIDATION_EMAIL_KEY } from "../config/ConfigurationKeys";
import { CreateTeacherRequestDTO } from "../dto/CreateTeacherRequestDTO";
import { TokenService } from "./TokenService";

const logger = createLoggerWithModuleName(module);

export class TeacherService {
  teacherDao: Repository<Teacher>;
  configurationService: ConfigurationService;
  tokenService: TokenService;

  constructor() {
    this.teacherDao = getConnection().getRepository(Teacher);
    this.configurationService = ConfigurationService.Instance;
    this.tokenService = new TokenService();
  }

  findByEmail = (email: string): Promise<Teacher> => {
    logger.info(`Find teacher by email ${email}`);
    return this.teacherDao.findOne({ email: email });
  };

  createTeacher = async (
    request: CreateTeacherRequestDTO
  ): Promise<ShallResult> => {
    const applyValitation = await this.configurationService.getBooleanValue(
      APPLY_VALIDATION_EMAIL_KEY,
      false
    );
    logger.info(`Apply validation ${applyValitation}`);
    if (applyValitation && !request.email.endsWith("fi.uba.ar")) {
      logger.error("The email not finished with fi.uba.ar");
      return Promise.resolve(new FailedResult("Invalid email"));
    }

    const alreadyExits = await this.checkIfTeacherAlreadyExists(request.email);
    if (alreadyExits) {
      return Promise.resolve(
        new FailedResult("A teacher already exits with that email")
      );
    }
    const newTeacher = new Teacher();
    newTeacher.email = request.email;
    newTeacher.name = request.name;
    newTeacher.lastname = request.lastname;
    newTeacher.asignature = request.asignature;
    newTeacher.ocupation = request.ocupation;
    newTeacher.legajo = request.legajo;
    return this.teacherDao
      .save(newTeacher)
      .then((response) => {
        logger.info(`create teacher success for ${response.email}`);
        const token = this.tokenService.createTokenByEmail(newTeacher.email);
        return Promise.resolve(new SucessResult(token));
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  };

  checkIfTeacherAlreadyExists = (teacherEmail: string): Promise<boolean> => {
    return this.findByEmail(teacherEmail)
      .then((teacher) => {
        logger.info(`Teacher ${teacher}`);
        return teacher != undefined;
      })
      .catch((reason) => {
        throw reason;
      });
  };

  findByEmailWithQuestionaries = (email: string): Promise<Teacher> => {
    logger.info(`Find teacher by email and questionaries ${email}`);
    return this.teacherDao.findOne({
      where: { email: email },
      relations: ["createdQuestionaries"],
    });
  };
}
