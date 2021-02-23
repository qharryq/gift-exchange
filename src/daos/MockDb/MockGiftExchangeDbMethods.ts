import jsonfile from 'jsonfile';
import { IGiftExchange } from '@entities/GiftExchange';

interface IDatabase {
    giftAssignments: IGiftExchange[];
}

class MockGiftExchangeDbMethods {

    private readonly dbFilePath = 'src/daos/MockDb/MockGiftExchangeDb.json';

    protected openDb(): Promise<IDatabase> {
        return jsonfile.readFile(this.dbFilePath) as Promise<IDatabase>;
    }

    protected saveDb(db: IDatabase): Promise<void> {
        return jsonfile.writeFile(this.dbFilePath, db);
    }
}

export default MockGiftExchangeDbMethods;
