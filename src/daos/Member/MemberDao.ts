import { IMember } from '@entities/Member';
import MockMemberDbMethods from '../MockDb/MockMemberDbMethods';

interface IMemberDao {
    getOne: (id: string) => Promise<IMember | null>;
    getAll: () => Promise<IMember[]>;
    add: (member: IMember) => Promise<IMember>;
    update: (member: IMember) => Promise<IMember | null>;
    delete: (id: string) => Promise<boolean>;
}

class MemberDao extends MockMemberDbMethods implements IMemberDao {

    public async getOne(id: string): Promise<IMember | null> {
        const db = await super.openDb();
        for (const member of db.members) {
            if (member.id === id) {
                return member;
            }
        }
        return null;
    }

    public async getAll(): Promise<IMember[]> {
        const db = await super.openDb();
        return db.members;
    }

    public async emailInUse(email: string): Promise<boolean> {
        const db = await super.openDb();
        for (const member of db.members) {
            if (member.email === email) {
                return true;
            }
        }
        return false;
    }

    public async add(member: IMember): Promise<IMember> {
        if (await this.emailInUse(member.email)) {
            throw new Error('Another member is already using that email');
        }
        const db = await super.openDb();
        // bad unique id generator, but sufficient for a demo, actually switch it out for uuid
        member.id = Math.floor(Math.random() * 1000000000).toString();
        db.members.push(member);
        await super.saveDb(db);
        return member;
    }

    public async update(member: IMember): Promise<IMember | null> {
        const db = await super.openDb();
        for (let i = 0; i < db.members.length; i++) {
            if (db.members[i].id === member.id) {
                //if updating the member's email address, check that it isn't in use by someone else
                if (db.members[i].email !== member.email) {
                    if (await this.emailInUse(member.email)){
                        throw new Error('This email already belongs to another family member');
                    }
                }
                db.members[i] = member;
                await super.saveDb(db);
                return member;
            }
        }
        return null;
    }

    public async delete(id: string): Promise<boolean> {
        const db = await super.openDb();
        for (let i = 0; i < db.members.length; i++) {
            if (db.members[i].id === id) {
                db.members.splice(i, 1);
                await super.saveDb(db);
                return true;
            }
        }
        return false;
    }
}

export default MemberDao;
