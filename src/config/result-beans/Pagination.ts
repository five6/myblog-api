export class Pagination {
  constructor(payload: { currentPage: number; pageSize: number; }) {
    if(payload.currentPage)
      this.currentPage = +payload.currentPage;
    if(payload.pageSize) 
      this.pageSize = +payload.pageSize;
  }
  currentPage: number = 1;
  pageSize: number = 10;
}