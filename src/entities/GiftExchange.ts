export interface IGiftExchange {
    memberId: string;
    recipientId: string;
}

class GiftExchange implements IGiftExchange {

    memberId: string;
    recipientId: string;

    constructor(memberId: string, recipientId: string) {
        this.memberId = memberId;
        this.recipientId = recipientId;
    }
}

export default GiftExchange;
