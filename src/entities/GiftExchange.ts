// If using an actual database the memberId field would have a foreign key constraint
// referring to the id field in the Member table
// recentRecipientMemberIds stores the last 2 recipients each member got
// Although when querying the API, only the most recent recipient is returned
export interface IGiftExchange {
    memberId: string;
    recentRecipientMemberIds: string[];
}

class GiftExchange implements IGiftExchange {

    memberId: string;
    recentRecipientMemberIds: string[];

    constructor(memberId: string, recentRecipientMemberIds: string[]) {
        this.memberId = memberId;
        this.recentRecipientMemberIds = recentRecipientMemberIds;
    }
}

export default GiftExchange;
