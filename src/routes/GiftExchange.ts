import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import GiftExchangeDao from '@daos/GiftExchange/GiftExchangeDao';
import MemberDao from '@daos/Member/MemberDao';
import * as santa from '../secret-santa/secret-santa';

const router = Router();
const giftExchangeDao = new GiftExchangeDao();
const memberDao = new MemberDao();

export class GiftExchangeResponse {
    memberId: string;
    recipientMemberId: string;

    constructor(memberId: string, recipientMemberId: string) {
        this.memberId = memberId;
        this.recipientMemberId = recipientMemberId;
    }
}

/******************************************************************************
 *                      Get All Gift Assignment pairs - "GET /gift_exchange"
 ******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
    const giftAssignments = await giftExchangeDao.getAll();
    const result = giftAssignments.map(x => new GiftExchangeResponse(x.memberId, x.recentRecipientMemberIds[0]))
    return res.status(StatusCodes.OK).json(result);
});

/****************************************************************************************
 *               Randomly assign each member a recipient - "POST /gift_exchange/shuffle"
 ****************************************************************************************/

router.post('/shuffle', async (req: Request, res: Response) => {
    const members = await memberDao.getAll();
    let giftExchangeResult = await santa.calculateRecipientsLoop(members, members.length * 2, 0);
    //commit all giftExchanges to the db
    await giftExchangeDao.addOrUpdate(giftExchangeResult);
    const formattedResult = giftExchangeResult.map(x => new GiftExchangeResponse(x.memberId, x.recentRecipientMemberIds[0]))
    return res.status(StatusCodes.OK).json(formattedResult);
});

export default router;