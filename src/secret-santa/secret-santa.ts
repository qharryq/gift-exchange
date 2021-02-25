import GiftExchangeDao from '@daos/GiftExchange/GiftExchangeDao';
import GiftExchange from '@entities/GiftExchange';
import { IMember } from '@entities/Member';
import { IGiftExchange } from '@entities/GiftExchange';

/* 
    This file contains the logic for the secret-santa recipient assignment algorithm.
    It works as follows:

    1. It iterates through the family members (retrieved from the Members db).
    2. For each member it calculates the possible recipients remaining for them. (stored in shortlist array)
       It does this by looking at remainingRecipients array and looking up their previous recipients in the GiftExchange DB.
       Their recipients for the previous 2 years and their own member id is removed from their possible options.
       If a deadend is reached and there are no possible recipients for the member the entire process restarts at step 1.
    3. Otherwise the list of possible recipients are randomly shuffled and the first value is selected as the recipient.
    4. This resulting GiftExchange mapping is added to an array which keeps track of the pairs so far.
    5. That recipient is removed from remainingRecipients.
    6. the process continues until every member has been assigned a unique recipient or the max retries are surpassed,
       in which case an error is returned saying a selection could not be made with the current constraints.

    It's not a clever implementation as it works through sheer force/retries rather than graphs.
*/

const giftExchangeDao = new GiftExchangeDao();

export const shuffle = (arr: string[]) => {
    // Fisher-Yates shuffle algorithm
    let m = arr.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = arr[m];
      arr[m] = arr[i];
      arr[i] = t;
    }
}

export const getRecipient = async (member: IMember, remainingRecipients: string[]) => {
    // for each member construct a list of possible recipients
    // which is the remainingRecipients minus (the current member + it's recipients for the previous 2 shuffles)
    let previousRecipients = await giftExchangeDao.getRecentRecipients(member.id);
    let exclusions : string[] = [];
    if (previousRecipients.length > 0) {
        exclusions = previousRecipients;
    }
    
    exclusions.push(member.id);
    // get all remaining participants that are not in the current members disallowed recipients
    let shortlist = remainingRecipients.filter(x => !exclusions.includes(x));
    if (shortlist.length === 0) {
        // deadend
        return null;
    } else {
        // pick a random recipient
        shuffle(shortlist);
        let recipient = shortlist[0];
        previousRecipients.unshift(recipient);
        previousRecipients.length = 2;
        return new GiftExchange(member.id, previousRecipients);
    }
}
 
export const getRecipientPairs = async (members: IMember[]) => {
    let pairs: IGiftExchange[] = []
    let remainingRecipients = members.map(x => x.id);
    for await (const member of members) {
        let giftExchange = await getRecipient(member, remainingRecipients);
        if (!giftExchange) {
            // start over as there are no possible recipients for this member
            return null;
        } else {
            // remove the recipient from the array so that the same person can't be selected twice
            const index = remainingRecipients.indexOf(giftExchange.recentRecipientMemberIds[0]);
            remainingRecipients.splice(index,1);
            pairs.push(giftExchange);
        }
    }
    return pairs;
}

export const calculateRecipientsLoop = async (members: IMember[], maxRetries: number, currentIteration: number): Promise<IGiftExchange[]> => {
    if (currentIteration < maxRetries) {
        let result = await getRecipientPairs(members);
        if (result){
            return result;
        }
        else {
            currentIteration += 1;
            return await calculateRecipientsLoop(members, maxRetries, currentIteration);
        }
    } else {
        throw new Error('Retry limit exceeded. A selection could not be made using all the constraints after retrying ' + maxRetries + ' times');
    }
}