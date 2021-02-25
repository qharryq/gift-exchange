import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test } from 'supertest';
import jsonfile from 'jsonfile';

import app from '@server';
import Member, { IMember } from '@entities/Member';
import * as santa from '../../src/secret-santa/secret-santa';

describe('GiftExchange Routes', () => {

    const giftExchangePath = '/gift_exchange';
    const shufflePath = `/gift_exchange/shuffle`;

    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });

    describe('Shuffle algorithm', () => {
        it(`should return a JSON object with all the members and a status code of "${StatusCodes.OK}" if the
            request was successful.`, async (done) => {
            const members = [
                new Member('112654355', 'Mary Berry', 'maryberry@email.com'),
                new Member('112654356', 'John Smith', 'johnsmith@email.com'),
                new Member('112654357', 'Bruce Wayne', 'brucewayne@email.com')
            ];
            let giftExchangeResult = await santa.calculateRecipientsLoop(members, members.length * 2, 0)
            console.log(giftExchangeResult);
            giftExchangeResult.forEach(x =>
                expect(x.memberId).not.toEqual(x.recentRecipientMemberIds));
            done();
        });

        /*it(`should throw an error if the 3 year constraint cannot be applied
        i.e. with a group of just three it is impossible to satisfy this after the 2nd shuffle`, async (done) => {
            const members = [
                new Member('112654355', 'Mary Berry', 'maryberry@email.com'),
                new Member('112654356', 'John Smith', 'johnsmith@email.com'),
                new Member('112654357', 'Bruce Wayne', 'brucewayne@email.com')
            ];
            spyOn(MockGiftExchangeDbMethods.prototype, 'openDb').and.returnValue(jsonfile.readFile('./json/temp-db-test-2.json'));
            let giftExchangeResult = await santa.retryRecipientPairs(members, members.length * 2, 0)
            console.log(giftExchangeResult);
            giftExchangeResult.forEach(x =>
                expect(x.memberId).not.toEqual(x.recentRecipientMemberIds));
            done();
        });*/
    });

});
