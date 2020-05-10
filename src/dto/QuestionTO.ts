import { File } from "@babel/types"
import { OptionTO } from "./OptionTO";

export class QuestionTO {
    has_image: boolean;
    image_url: string;
    text: string;
    options: OptionTO[]
}