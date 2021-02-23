import { Response } from 'supertest';
import { IMember } from '@entities/Member';


export interface IResponse extends Response {
    body: {
        members: IMember[];
        error: string;
    };
}

export interface IReqBody {
    member?: IMember;
}
