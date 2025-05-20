import { BookingDto } from '../../employee/dto/booking.dto'; // Ou un DTO spécifique admin

export class EventDetailsDto {
    id: number;
    name: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    location?: string;
    capacity?: number;
    isActive: boolean;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    companyId?: number | null;
    companyName?: string | null;
    bookings?: Partial<BookingDto>[];
}