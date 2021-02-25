import { Response } from 'supertest';
import { IMember } from '@entities/Member';
import { IGiftExchange } from '@entities/GiftExchange'

export interface ISingleMemberResponse extends Response {
    body: {
        error: string;
        id: string;
        name: string;
        email: string;
    };
}

export interface IMultipleMembersResponse extends Response {
    body: IMember[];
}

export interface IGiftExchangeResponse extends Response {
    body: IGiftExchange[];
}

export interface IReqBody {
    member?: IMember;
}
