import { iGelatoOrderDetail } from './i-gelato-order-detail';

export interface iGelatoOrder {
  id: number;
  details: iGelatoOrderDetail[];
  totalPrice: number;
  orderDate: string;
  costumerName: string;
  email: string;
}
