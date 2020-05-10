import { Repository, getConnection } from "typeorm";
import { Admin } from "../entity/Admin";
import { CreateAdminRequestDTO } from "../dto/CreateAdminRequestDTO";
import { LoginService } from "./LoginService";
import { createLoggerWithModuleName } from "../config/logger"


const logger = createLoggerWithModuleName(module)

export class AdminService {
    private adminDao: Repository<Admin>
    private loginService: LoginService


    constructor() {
        this.adminDao = getConnection().getRepository(Admin)
        this.loginService = new LoginService()
    }


    // findOptionsByQuestionaryId(questionaryId: string) {
    //     this.optionDao.find({where:{}})
    // }

    isAdminByToken(token: string): Promise<boolean> {
        const userEmail = this.loginService.getEmailOfToken(token)
        return this.isAdmin(userEmail);
    }

    isAdmin(email: string): Promise<boolean> {
        logger.info(`Search user by email ${email} is admin`)
        const adminPromise: Promise<Admin> = this.adminDao.findOneOrFail({ email: email })
        return adminPromise.then((admin) => {
            return true
        }).catch((reason) => {
            return false;
        })
    }

    addAdmin(req: CreateAdminRequestDTO): Promise<Admin> {
        const adminToInsert = new Admin()
        adminToInsert.email = req.email
        adminToInsert.readPermission = req.read_permission
        adminToInsert.writePermission = req.write_permission
        return this.adminDao.save(adminToInsert)
    }
}