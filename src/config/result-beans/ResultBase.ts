export class ResultBase {
    constructor(code: number, msg: string) {
        this.code = code;
        this.msg = msg;
    }

    code: number;
    msg: string;

}
