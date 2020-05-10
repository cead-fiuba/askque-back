import { ShallResult } from "./ShallResult";

export class SucessResult extends ShallResult {

    constructor(res: any) { super(true, res) }
}