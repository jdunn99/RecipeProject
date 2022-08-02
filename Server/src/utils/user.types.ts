export interface RegisterParams {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginParams {
    email: string;
    password: string;
}

export interface AuthenticationResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}
