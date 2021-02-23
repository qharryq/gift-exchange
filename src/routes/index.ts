import { Router } from 'express';
import MemberRouter from './Members';
import GiftExchangeRouter from './GiftExchange';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/members', MemberRouter);
router.use('/gift_exchange', GiftExchangeRouter);

// Export the base-router
export default router;
