import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import MemberDao from '@daos/Member/MemberDao.mock';
//import { paramMissingError, IRequest } from '@shared/constants';
import Member from '@entities/Member';


import { validateObject, validationError } from '../shared/validation';

import { IsEmail, Max } from 'class-validator';

const router = Router();
const memberDao = new MemberDao();
const { BAD_REQUEST, CREATED, OK, NOT_FOUND } = StatusCodes;


export class CreateMemberRequest {
    @IsEmail()
    email: string;
    name: string;

    // Default constructor used by json-typescript-mapper
    constructor() {
        this.email = undefined;
        this.name = undefined;
    }
}

export class UpdateMemberRequest {
    id: string;
    @IsEmail()
    email: string;
    name: string;

    // Default constructor used by json-typescript-mapper
    constructor() {
        this.id = undefined;
        this.email = undefined;
        this.name = undefined;
    }
}

/******************************************************************************
 *                      Get All Members - "GET /members"
 ******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
    const members = await memberDao.getAll();
    return res.status(StatusCodes.OK).json(members);
});