import jsonfile from 'jsonfile';
import { IMember } from '@entities/Member';

interface IDatabase {
    members: IMember[];
}

class MockMemberDbMethods {

    private readonly dbFilePath = 'src/daos/MockDb/MockMembersDb.json';

    public openDb(): Promise<IDatabase> {
        return jsonfile.readFile(this.dbFilePath) as Promise<IDatabase>;
    }

    protected saveDb(db: IDatabase): Promise<void> {
        return jsonfile.writeFile(this.dbFilePath, db);
    }
}

export default MockMemberDbMethods;
