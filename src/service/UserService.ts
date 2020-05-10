import { Teacher } from "../entity/Teacher";
import { Repository, getConnection } from "typeorm";

export class UserService {

    private userDao: Repository<Teacher>

    constructor() {
        this.userDao = getConnection().getRepository(Teacher)
    }

    findByEmail(email: string): Promise<Teacher> {
        return this.userDao.findOne({ email })
    }
}