export class EventListItemDto {
    id: number;
    name: string;
    startDate: Date;
    location?: string;
    isActive: boolean;
    companyName?: string | null;
    bookingCount?: number;
}