import { QuestionTO } from "./QuestionTO";

export class CreateQuestionaryRequestDTO {

    hash: string;

    module: string;

    is_new: boolean;

    name: string;

    asignature: string;

    description: string

    time: number;

    questions: QuestionTO[]

}