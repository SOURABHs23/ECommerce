export type AddressType = 'SHIPPING' | 'BILLING';

export interface Address {
    id: number;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    type: AddressType;
    isDefault: boolean;
}

export interface AddressRequest {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    type: AddressType;
    isDefault?: boolean;
}
