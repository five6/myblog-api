import { ResultBase } from './ResultBase';

export class ResultPagination extends ResultBase {
    constructor(payload: {items: any[]; code: number, msg: string; totalCount: number}) {
      super(payload.code, payload.msg);
      this.items = payload.items;
      this.totalCount = payload.totalCount;
    }
    items: any[];
    totalCount: number;
  }
