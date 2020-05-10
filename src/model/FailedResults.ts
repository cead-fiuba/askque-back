import { ShallResult } from "./ShallResult";

export class FailedResult extends ShallResult {

    constructor(message: string) { super(false, message) }
}