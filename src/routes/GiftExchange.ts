import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import GiftExchangeDao from '@daos/GiftExchange/GiftExchangeDao';
import GiftExchange from '@entities/GiftExchange';


import { validateObject, validationError } from '../shared/validation';

const router = Router();
const giftExchangeDao = new GiftExchangeDao();
const { BAD_REQUEST, CREATED, OK, NOT_FOUND } = StatusCodes;


/******************************************************************************
 *                      Get All Gift Assignment pairs - "GET /gift_exchange"
 ******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
    const giftAssignments = await giftExchangeDao.getAll();
    return res.status(StatusCodes.OK).json(giftAssignments);
});

export default router;