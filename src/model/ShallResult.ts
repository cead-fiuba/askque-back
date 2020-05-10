
export class ShallResult {

    sucess: boolean

    result: any

    constructor(sucess: boolean, result: any) {
        this.sucess = sucess;
        this.result = result;
    }

    isSucess() {
        return this.sucess;
    }

    getResult() {
        return this.result
    }
}
