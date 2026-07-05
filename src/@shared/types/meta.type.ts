export type TMeta = {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

export type TPaginatedResponse<T> = {
  items: T[];
  meta: TMeta;
};
