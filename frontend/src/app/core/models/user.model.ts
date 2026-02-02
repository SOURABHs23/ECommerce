export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    mobile: number;
    verifyEmail: boolean;
    verifyMobile: boolean;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
}

export interface SignUpRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    mobile: number;
}

export interface SignInRequest {
    email: string;
    password: string;
}
