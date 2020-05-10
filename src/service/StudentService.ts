import { Student } from "../entity/Student";
import { Repository, getConnection } from "typeorm";
import { CreateStudentRequestDTO } from "../dto/CreateStudentRequestDTO";
import { createLoggerWithModuleName } from "../config/logger"


const logger = createLoggerWithModuleName(module)

export class StudentService {

    private studentDao: Repository<Student>

    constructor() {
        this.studentDao = getConnection().getRepository(Student)
    }

    async createStudent(request: CreateStudentRequestDTO): Promise<Student> {
        const student: Student = await this.studentDao.findOne({ where: { email: request.email } })
        if (student) {
            logger.error('There is already a student with that email')
            return Promise.reject(new Error('there is already a student with that email'))
        }
        const newStudent = new Student()
        newStudent.padron = request.padron
        newStudent.name = request.name
        newStudent.email = request.email
        newStudent.password = request.password
        return this.studentDao.save(newStudent)
    }

    async findByEmail(email: string): Promise<Student> {
        logger.info('Find student by email', email)
        return this.studentDao.findOne({ email })
    }
}