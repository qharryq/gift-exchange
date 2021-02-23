import { Router } from 'express';
import MemberRouter from './Members';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/members', MemberRouter);

// Export the base-router
export default router;
