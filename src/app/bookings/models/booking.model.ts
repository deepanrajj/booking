export type BookingMode = 'select' | 'random';

export interface Booking {
    id: string;
    firstName: string;
    lastName: string;
    guestNumber: number;
    bookedFrom: Date;
    bookedTo: Date;
    placeId: string;
    placeTitle: string;
    placeImage: string;
    userId: string;
}

export interface FirebaseBookingData {
    firstName: string;
    lastName: string;
    guestNumber: number;
    bookedFrom: string;
    bookedTo: string;
    placeId: string;
    placeTitle: string;
    placeImage: string;
    userId: string;
}
