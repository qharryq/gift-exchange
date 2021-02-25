import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test } from 'supertest';

import app from '@server';
import MemberDao from '@daos/Member/MemberDao';
import Member, { IMember } from '@entities/Member';
import { pErr } from '@shared/functions';
import { ISingleMemberResponse, IMultipleMembersResponse } from '../support/types';
import { CreateMemberRequest } from 'src/routes/Members';

describe('Members Routes', () => {

    const membersPath = '/members';
    const getSpecificMembersPath = `${membersPath}/:id`;
    const deleteMembersPath = `${membersPath}/:id`;

    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });

    describe(`"GET:${membersPath}"`, () => {

        it(`should return a JSON object with all the members and a status code of "${StatusCodes.OK}" if the
            request was successful.`, (done) => {
            const members = [
                new Member('112654355', 'Mary Berry', 'maryberry@email.com'),
                new Member('112654356', 'John Smith', 'johnsmith@email.com'),
                new Member('112654357', 'Bruce Wayne', 'brucewayne@email.com')
            ];
            spyOn(MemberDao.prototype, 'getAll').and.returnValue(Promise.resolve(members));
            agent.get(membersPath)
                .end((err: Error, res: IMultipleMembersResponse) => {
                    pErr(err);
                    expect(res.status).toBe(StatusCodes.OK);
                    const respMembers = res.body;
                    const retMembers: Member[] = respMembers.map((mem: IMember) => {
                        return new Member(mem.id, mem.name, mem.email);
                    });
                    console.log(respMembers);
                    console.log(retMembers);
                    expect(retMembers).toEqual(members);
                    done();
                });
        });
    });

    describe(`"POST:${membersPath}"`, () => {

        const callApi = (reqBody: CreateMemberRequest) => {
            return agent.post(membersPath).type('form').send(reqBody);
        };

        const memberData = {
            id: '123456778',
            name: 'Harry Quigley',
            email: 'harryq@test.com'
        };

        it(`should return a status code of "${StatusCodes.CREATED}" if the request was successful.`, (done) => {
            spyOn(MemberDao.prototype, 'add').and.returnValue(Promise.resolve(memberData));
            agent.post(membersPath).type('form').send(memberData)
                .end((err: Error, res: ISingleMemberResponse) => {
                    pErr(err);
                    expect(res.status).toBe(StatusCodes.CREATED);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "email must be an email" and a status
            code of "${StatusCodes.UNPROCESSABLE_ENTITY}" if the email field doesn't have the required format.`, (done) => {
            callApi({name: 'harry quigley', email: 'invalidtest'})
                .end((err: Error, res: ISingleMemberResponse) => {
                    pErr(err);
                    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
                    done();
                });
        });
    });

   describe(`"PUT:${membersPath}"`, () => {

        const callApi = (reqBody: IMember) => {
            return agent.put(membersPath).type('json').send(reqBody);
        };

        const memberData = {
            id: '112654355',
            name: 'Mary Berry',
            email: 'maryberry.newemail@email.com'
        };

        it(`should return a status code of "${StatusCodes.OK}" if the request was successful. The updated entity should be returned in the response body`, (done) => {
            spyOn(MemberDao.prototype, 'update').and.returnValue(Promise.resolve(memberData));
            callApi(memberData)
                .end((err: Error, res: ISingleMemberResponse) => {
                    pErr(err);
                    expect(res.status).toBe(StatusCodes.OK);
                    expect(res.body.email).toEqual("maryberry.newemail@email.com");
                    done();
                });
        });
    });
});
