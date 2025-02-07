import { iScoopQuantity } from './i-scoop-quantity';

export interface iGelatoOrderDetail {
  totalScoops: number;
  scoopQuantities: iScoopQuantity[];
}
