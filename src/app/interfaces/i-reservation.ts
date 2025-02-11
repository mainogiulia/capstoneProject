export interface iReservation {
  id?: number;
  customerName: string;
  email: string;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  cancellationCode?: string;
}
