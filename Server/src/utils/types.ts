export interface Error {
    field: string;
    message: string;
}

export interface ServiceResponse<T> {
    errors?: Error[];
    response?: T;
}
