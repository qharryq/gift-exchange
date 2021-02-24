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

    public async getRecentRecipients(id: string): Promise<string[] | null> {
        const db = await super.openDb();
        console.log('getting the recent recipients for '+ id);
        console.log('looping throught the recent recipients db');
        for await (const assignment of db.giftAssignments) {
            console.log(assignment);
            if (assignment.memberId === id) {
                console.log('heres the bleediin assignment ' + assignment.recentRecipientMemberIds);
                return assignment.recentRecipientMemberIds;
            }
        }
        return null;
    }

    // add all the giver/recipient pairs in one transaction to avoid partial success
    public async addOrUpdate(giftExchanges: IGiftExchange[]): Promise<IGiftExchange[]> {
        console.log('ok im commiting now ' + giftExchanges);
        const db = await super.openDb();
        for await (const ge of giftExchanges) {
            console.log(ge.memberId + 'is buying for ' + ge.recentRecipientMemberIds[0])
            console.log('here are the current figt assignments in db');
            for (const y of db.giftAssignments){
                console.log(y);
            }
            console.log('trying sumn');
            console.log(db.giftAssignments[0]);
            console.log(ge.memberId);
            let index = db.giftAssignments.findIndex(x => x.memberId === ge.memberId)
            if (index === -1) {
                console.log('dunnae exist');
                db.giftAssignments.push(ge);
            } else {
                console.log('it exists and im inserting at' + index );
                db.giftAssignments[index] = ge;
            }
        }

        await super.saveDb(db);
        return giftExchanges;
    }

}

export default GiftExchangeDao;
