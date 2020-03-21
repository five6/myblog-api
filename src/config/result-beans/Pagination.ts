export class Pagination {
  constructor(payload: { currentPage: number; pageSize: number; }) {
    this.currentPage = payload.currentPage;
    this.pageSize = payload.pageSize;
  }
  currentPage: number;
  pageSize: number;
}