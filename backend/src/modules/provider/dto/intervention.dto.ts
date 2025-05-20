import { BookingStatus } from "../../../common/entity/booking.entity";

export class InterventionDto { 
    bookingId: number;
    bookingDate: Date;
    status: BookingStatus;
    serviceTitle?: string;
    itemType: 'Service' | 'Event';
    employeeName?: string;
    companyName?: string;
    location?: string;
    notes?: string;
}