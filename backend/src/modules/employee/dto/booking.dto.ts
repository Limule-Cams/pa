import { BookingStatus } from "../../../common/entity/booking.entity";

export class BookingDto {
  id: number;
  bookingDate: Date; 
  status: BookingStatus; 
  serviceTitle?: string; 
  itemType: 'Service' | 'Event'; 
  location?: string; 
  providerName?: string;
  notes?: string;
  createdAt: Date; 
}