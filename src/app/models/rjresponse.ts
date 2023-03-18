export class RJResponse<T> {
  data!: T;
  currentNo!: number;
  startNo!: number;
  endNo!: number;
  status!: number;
  message!: string;
}
