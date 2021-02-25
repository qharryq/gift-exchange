import { IGiftExchange } from '@entities/GiftExchange';
import MockGiftExchangeDbMethods from '../MockDb/MockGiftExchangeDbMethods';

interface IGiftExchangeDao {
    getAll: () => Promise<IGiftExchange[]>;
    getRecentRecipients: (id: string) => Promise<string[]>;
    addOrUpdate: (giftExchanges: IGiftExchange[]) => Promise<void>;
}

class GiftExchangeDao extends MockGiftExchangeDbMethods implements IGiftExchangeDao {

    public async getAll(): Promise<IGiftExchange[]> {
        const db = await super.openDb();
        return db.giftAssignments;
    }

    // Each member may only have the same recipient once every 3 years
    public async getRecentRecipients(id: string): Promise<string[]> {
        const db = await super.openDb();
        for (const assignment of db.giftAssignments) {
            if (assignment.memberId === id) {
                return assignment.recentRecipientMemberIds;
            }
        }
        return [];
    }

    // commit all the giver/recipient pairs in one transaction to avoid partial success
    // i.e. make it atomic
    public async addOrUpdate(giftExchanges: IGiftExchange[]): Promise<void> {
        const db = await super.openDb();
        for (const ge of giftExchanges) {
            let index = db.giftAssignments.findIndex(x => x.memberId === ge.memberId)
            if (index === -1) {
                // this member did not exist in previous 'years'
                db.giftAssignments.push(ge);
            } else {
                // update the existing members recipient list
                db.giftAssignments[index] = ge;
            }
        }
        await super.saveDb(db);
    }

}

export default GiftExchangeDao;
