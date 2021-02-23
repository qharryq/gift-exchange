import { IGiftExchange } from '@entities/GiftExchange';
import MockGiftExchangeDbMethods from '../MockDb/MockGiftExchangeDbMethods';

interface IGiftExchangeDao {
    getAll: () => Promise<IGiftExchange[]>;
}

class GiftExchangeDao extends MockGiftExchangeDbMethods implements IGiftExchangeDao {

    public async getAll(): Promise<IGiftExchange[]> {
        const db = await super.openDb();
        return db.giftAssignments;
    }
}

export default GiftExchangeDao;
