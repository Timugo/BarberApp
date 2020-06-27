import { OrderHistory } from './order';

export interface GetOrdersRepository {
  response : number,
  content : [OrderHistory]
}