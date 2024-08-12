export interface CountryType {
    _id: string;
    name: string;
    dial_code: string;
    code: string;
    __v: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export type SInputs = {
    name: string;
    password: string;
    email: string;
    country_code: string;
    phone: number;
    time_zone: string;
    status?: boolean;
    varified?: boolean;
};

export type SSInputs = {
    storeName: string;
    storeEmail: string;
    countryCode: number;
    storePhone: number;
    time_zone: string;
    storeCurrency: string;
    currencyAlignment: string;
};


export type LInputs = {
    steetAddress: string;
    longitude: number;
    latitude: number;
    zipCode: string;
    landmark: string;
};
export type AInputs = {
    name: string;
    email: string;
    password: string;
    phone: number;
    pin: string;
    countryCode: number;
    status: boolean;
    verified: boolean;
};

export type ICurrency = {
    _id: string,
    name: string,
    code: string,
    symbol: string,
    country: string,
    priority: 0,
    is_active: true,
    __v: 0
}
