import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { IsEmail } from 'class-validator';
import MemberDao from '@daos/Member/MemberDao';
import { validateObject, validationError } from '../shared/validation';

const router = Router();
const memberDao = new MemberDao();

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

/******************************************************************************
 *                      Get Member by Id - "GET /members/:id"
 ******************************************************************************/

router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const member = await memberDao.getOne(id);
    if (!member) {
        return res.status(StatusCodes.NOT_FOUND).json({error: 'Member ID not found'});
    }
    return res.status(StatusCodes.OK).json(member);
});

/******************************************************************************
 *                       Add Member - "POST /members/"
 ******************************************************************************/

router.post('/', validateObject(CreateMemberRequest), async (req: Request, res: Response) => {
    const member = req.body
    const createdMember = await memberDao.add(member);
    return res.status(StatusCodes.CREATED).json(createdMember);
});

/******************************************************************************
 *                       Update - "PUT /api/members/update"
 ******************************************************************************/

router.put('/', validateObject(UpdateMemberRequest), async (req: Request, res: Response) => {
    const member = req.body;
    const updatedMember = await memberDao.update(member);
    if (!updatedMember){
        return res.status(StatusCodes.NOT_FOUND).json({error: 'Member ID not found'});
    }
    return res.status(StatusCodes.OK).json(updatedMember);
});

/******************************************************************************
 *                    Delete - "DELETE /members/:id"
 ******************************************************************************/

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    if (await memberDao.delete(id)) {
        return res.status(StatusCodes.OK).json('Member successfully deleted');
    }
    return res.status(StatusCodes.NOT_FOUND).json({error: 'Member ID not found'});
});

router.use(validationError);

export default router;
