export interface IGiftExchange {
    memberId: string;
    recipientMemberId: string;
}

class GiftExchange implements IGiftExchange {

    memberId: string;
    recipientMemberId: string;

    constructor(memberId: string, recipientMemberId: string) {
        this.memberId = memberId;
        this.recipientMemberId = recipientMemberId;
    }
}

export default GiftExchange;
