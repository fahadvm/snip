import { Request } from 'express';

export interface RequestWithUser extends Request {
    user: {
        userId: string;
        email: string;
        id?: string; // Some guards might set 'id' instead of 'userId'
    };
}
