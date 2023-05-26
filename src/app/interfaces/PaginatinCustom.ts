export class PaginationCustom {
  prev: number = 0;
  current: number = 1;
  next: number = 2;
  currentFirstObjectId !: number;
  currentLastObjectId: number = -1;
  productsLimit: number = 2
  type !: PaginationType;
}

export enum PaginationType {
  NEXT,
  PREVIOUS,
  START,
  END
}
