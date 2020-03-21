import { ResultBase } from './ResultBase';

export class Result extends ResultBase {
  constructor(payload: {datas: any; code: number; msg: string}) {
    super(payload.code, payload.msg);
    this.datas = payload.datas;
  }

  datas: any;
}
