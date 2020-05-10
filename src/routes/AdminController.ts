import { JsonController, Post, Body, Get, HeaderParam } from "routing-controllers";
import { createLoggerWithModuleName } from "../config/logger"
import { CreateAdminRequestDTO } from "../dto/CreateAdminRequestDTO";
import { AdminService } from "../service/AdminService";
import { InsertResult } from "typeorm";
import { Admin } from "../entity/Admin";

const logger = createLoggerWithModuleName(module)


@JsonController()
export class AdminController {

    adminService: AdminService
    constructor() {
        this.adminService = new AdminService();
    }

    @Post("/admin")
    createAdmin(@Body() request: CreateAdminRequestDTO) {
        logger.info('Add new admin')
        return this.adminService.addAdmin(request).then((value: Admin) => {
            logger.info('Creation success')
            return {
                code: "Admin created",
                message: `The admin with ${value.email} email was created`
            }
        }).catch((reason) => {
            logger.info('Creation failed')
            return {
                code: "Creation failed",
                message: `Cannot create admin to user ${request.email} because ${reason}`
            }
        })
    }

    @Get("/admin")
    async findAdminByToken(@HeaderParam('Authorization', { required: true }) token: string) {
        const isAdmin = await this.adminService.isAdminByToken(token)
        const permissions = isAdmin ? "ADMIN" : "NONE"
        return {
            permissions: permissions
        }
    }

}