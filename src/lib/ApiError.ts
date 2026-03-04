export class ApiError extends Error {
    status: number;
    data: any;

    constructor(status: number, message: string, data?: any) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';

        // In some environments, extending Error requires manually setting the prototype
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
