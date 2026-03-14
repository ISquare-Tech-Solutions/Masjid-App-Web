// ============================================
// Settings Types — matches backend DTOs
// ============================================

export interface MasjidAddress {
    line1: string | null;
    line2: string | null;
    city: string | null;
    postcode: string | null;
    country: string | null;
}

export interface MasjidContact {
    phone: string | null;
    email: string | null;
    website: string | null;
}

export interface MasjidLocation {
    latitude: number | null;
    longitude: number | null;
}

export interface MasjidCapacity {
    mens: number | null;
    womens: number | null;
}

export interface MasjidServices {
    marriageService: boolean;
    hallRental: boolean;
    iftarProgram: boolean;
    counseling: boolean;
    newMuslimSupport: boolean;
    funeralService: boolean;
}

export interface MasjidFacilities {
    parking: boolean;
    womensArea: boolean;
    shoeRacks: boolean;
    wuduFacilities: boolean;
    washroom: boolean;
}

export interface MasjidPayment {
    bankAccountName: string | null;
    bankName: string | null;
    bankAccountNumber: string | null;
    bankSortCode: string | null;
}

export interface MasjidSettingsResponse {
    id: string;
    name: string;
    about: string | null;
    logoUrl: string | null;
    address: MasjidAddress;
    contact: MasjidContact;
    location: MasjidLocation;
    capacity: MasjidCapacity;
    services: MasjidServices;
    facilities: MasjidFacilities;
    payment: MasjidPayment;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateMasjidSettingsRequest {
    name: string;
    about?: string | null;
    address?: MasjidAddress;
    contact?: MasjidContact;
    location?: MasjidLocation;
    capacity?: MasjidCapacity;
    services?: MasjidServices;
    facilities?: MasjidFacilities;
}

export interface UpdatePaymentSettingsRequest {
    bankAccountName: string | null;
    bankName: string | null;
    bankAccountNumber: string | null;
    bankSortCode: string | null;
}
