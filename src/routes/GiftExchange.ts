import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import GiftExchangeDao from '@daos/GiftExchange/GiftExchangeDao';
import GiftExchange from '@entities/GiftExchange';
import MemberDao from '@daos/Member/MemberDao';


import { validateObject, validationError } from '../shared/validation';
import { IMember } from '@entities/Member';
import { IGiftExchange } from '@entities/GiftExchange';

const router = Router();
const giftExchangeDao = new GiftExchangeDao();
const memberDao = new MemberDao();
const { BAD_REQUEST, CREATED, OK, NOT_FOUND } = StatusCodes;

const shuffle = (arr: string[]) => {
    // Fisher-Yates shuffle algorithm
    // While there remain elements to shuffle
    // Pick a remaining element
    // And swap it with the current element
    let m = arr.length, t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = arr[m];
      arr[m] = arr[i];
      arr[i] = t;
    }
}

/*const getRecipientPair = async (member: IMember[]) => {

}*/
 
const getRecipientPairs = async (members: IMember[], maxRetries: number, currentIteration: number) => {
    while (currentIteration < maxRetries) {
        console.log('loop ' + currentIteration)
        let pairs: IGiftExchange[] = []
        let remainingRecipients = members.map(x => x.id);
        for await (const member of members) {
            // for each member construct a list of possible recipients
            // which is the remainingRecipients minus (the current member + it's recipients for the previous 2 shuffles)
            console.log('trying to get recent recips')
            let previousRecipients = await giftExchangeDao.getRecentRecipients(member.id);
            console.log('gotem');
            let exclusions : string[] = [];
            console.log(exclusions);
            if (previousRecipients) {
                console.log('inside here')
                exclusions = (previousRecipients);
            }
            console.log(exclusions);
            exclusions.push(member.id);

            // get all remaining participants that are not in the current members disallowed recipients
            console.log('the allowed shortlist for memberId ' + member.id)
            let difference = remainingRecipients.filter(x => !exclusions.includes(x));
            console.log(difference);    
            if (difference.length === 0) {
                console.log("NO OPTIONS AHHHH")
                // deadend
                // start over as there are no possible recipients for this member
                currentIteration += 1;
                //call async task inside async task without completing the first
                await getRecipientPairs(members, maxRetries, currentIteration);
            } else {
                // pick a random recipient
                shuffle(difference);
                let recipient = difference[0];
                console.log('landed on ' + recipient);
                // remove that recipient from the array so that the same person can't be selected twice
                const index = remainingRecipients.indexOf(recipient);
                remainingRecipients.splice(index,1);

                let updatedRecipients : string[] = [];
                if (previousRecipients) {
                    updatedRecipients.concat(previousRecipients);
                }
                updatedRecipients.unshift(recipient);
                //updatedRecipients.length = 2;
                console.log('updated recipients is ' + updatedRecipients);

                let giftExchange = new GiftExchange(member.id, updatedRecipients);
                pairs.push(giftExchange);
                console.log('pairs at this point');
                console.log(pairs);
            }

            
        }
        console.log('pairs being returned in final result from here');
        console.log(pairs);
        return pairs;
    }
    throw new Error('A selection could not be made using all the constrains after retrying ' + maxRetries + 'times');
}

/******************************************************************************
 *                      Get All Gift Assignment pairs - "GET /gift_exchange"
 ******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
    const giftAssignments = await giftExchangeDao.getAll();
    return res.status(StatusCodes.OK).json(giftAssignments);
});

/******************************************************************************
 *               Randomly assign each member a recipient - "POST /gift_exchange/shuffle"
 ******************************************************************************/

router.post('/shuffle', async (req: Request, res: Response) => {

    // get all members from db
    const members = await memberDao.getAll();
    
    // if there are 2 members or less throw error saying there are not enough people to do secret santa

    // if there are less than 5 people secret sanata can be done, but leaving out the last 3 years constraint

    // otherwise operate as normal

    // keep an array of the giver/recipient pairs and commit them all to the db at once at the end
    let maxRetries = members.length;
    let currentIteration = 0;

    
    
    getRecipientPairs(members, maxRetries, currentIteration).then((result) => {
        console.log('next is pairs in here');
        console.log(result);
        //commit all updates to db
        //const recipientResult = await giftExchangeDao.addOrUpdate(pairs);
        console.log('returning')
        return res.status(StatusCodes.OK).json(result);
    });

});

export default router;