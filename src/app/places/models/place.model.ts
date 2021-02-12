export interface Place {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    availableFrom: Date;
    availableTo: Date;
    userId: string;
}

export interface FirebaseResponse {
    name: string;
}

export interface FirebasePlaceData {
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    availableFrom: string;
    availableTo: string;
    userId: string;
}
