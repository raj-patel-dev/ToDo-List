export interface ITaskPagination {
    limit: number;
    page: number;
    order: "asc" | "desc";
}