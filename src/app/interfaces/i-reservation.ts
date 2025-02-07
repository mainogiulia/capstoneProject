export interface iReservation {
  id?: number;
  customerName: string;
  email: string;
  reservationDate: string;
  numberOfGuests: number;
  cancellationCode?: string;
}
