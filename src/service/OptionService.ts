import { Option } from "../entity/Option";
import { Repository, getConnection } from "typeorm";

export class OptionService {
    private optionDao: Repository<Option>


    constructor() {
        this.optionDao = getConnection().getRepository(Option)
    }


    // findOptionsByQuestionaryId(questionaryId: string) {
    //     this.optionDao.find({where:{}})
    // }
}