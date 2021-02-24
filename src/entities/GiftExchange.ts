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
