import { iGelatoOrderDetail } from './i-gelato-order-detail';

export interface iGelatoOrder {
  id: number;
  details: iGelatoOrderDetail[];
  totalPrice: number;
  orderDate: string;
  deliveryAddress: string;
  costumerName: string;
  email: string;
}
