import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test } from 'supertest';

import app from '@server';
import MemberDao from '@daos/Member/MemberDao.mock';
import Member, { IMember } from '@entities/Member';
import { pErr } from '@shared/functions';
import { paramMissingError } from '@shared/constants';
import { IReqBody, IResponse } from '../support/types';



describe('Members Routes', () => {

    const membersPath = '/api/members';
    const getMembersPath = `${membersPath}/all`;
    const addMembersPath = `${membersPath}/add`;
    const updateMemberPath = `${membersPath}/update`;
    const deleteMemberPath = `${membersPath}/delete/:id`;

    const { BAD_REQUEST, CREATED, OK } = StatusCodes;
    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });

    describe(`"GET:${getMembersPath}"`, () => {

        it(`should return a JSON object with all the members and a status code of "${OK}" if the
            request was successful.`, (done) => {
            // Setup spy
            const members = [
                new Member('Sean Maxwell', 'sean.maxwell@gmail.com'),
                new Member('John Smith', 'john.smith@gmail.com'),
                new Member('Gordan Freeman', 'gordan.freeman@gmail.com'),
            ];
            spyOn(MemberDao.prototype, 'getAll').and.returnValue(Promise.resolve(members));
            // Call API
            agent.get(getMembersPath)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    // Caste instance-objects to 'Member' objects
                    const respMembers = res.body.members;
                    const retMembers: Member[] = respMembers.map((member: IMember) => {
                        return new Member(member);
                    });
                    expect(retMembers).toEqual(members);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'Could not fetch members.';
            spyOn(MemberDao.prototype, 'getAll').and.throwError(errMsg);
            // Call API
            agent.get(getMembersPath)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    describe(`"POST:${addMembersPath}"`, () => {

        const callApi = (reqBody: IReqBody) => {
            return agent.post(addMembersPath).type('form').send(reqBody);
        };

        const memberData = {
            member: new Member('Gordan Freeman', 'gordan.freeman@gmail.com'),
        };

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
            // Setup Spy
            spyOn(MemberDao.prototype, 'add').and.returnValue(Promise.resolve());
            // Call API
            agent.post(addMembersPath).type('form').send(memberData)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${paramMissingError}" and a status
            code of "${BAD_REQUEST}" if the member param was missing.`, (done) => {
            // Call API
            callApi({})
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(paramMissingError);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'Could not add member.';
            spyOn(MemberDao.prototype, 'add').and.throwError(errMsg);
            // Call API
            callApi(memberData)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });

    describe(`"PUT:${updateMemberPath}"`, () => {

        const callApi = (reqBody: IReqBody) => {
            return agent.put(updateMemberPath).type('form').send(reqBody);
        };

        const memberData = {
            member: new Member('Gordan Freeman', 'gordan.freeman@gmail.com'),
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            // Setup spy
            spyOn(MemberDao.prototype, 'update').and.returnValue(Promise.resolve());
            // Call Api
            callApi(memberData)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${paramMissingError}" and a
            status code of "${BAD_REQUEST}" if the member param was missing.`, (done) => {
            // Call api
            callApi({})
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(paramMissingError);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup spy
            const updateErrMsg = 'Could not update member.';
            spyOn(MemberDao.prototype, 'update').and.throwError(updateErrMsg);
            // Call API
            callApi(memberData)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(updateErrMsg);
                    done();
                });
        });
    });

    describe(`"DELETE:${deleteMemberPath}"`, () => {

        const callApi = (id: number) => {
            return agent.delete(deleteMemberPath.replace(':id', id.toString()));
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            // Setup spy
            spyOn(MemberDao.prototype, 'delete').and.returnValue(Promise.resolve());
            // Call api
            callApi(5)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup spy
            const deleteErrMsg = 'Could not delete member.';
            spyOn(MemberDao.prototype, 'delete').and.throwError(deleteErrMsg);
            // Call Api
            callApi(1)
                .end((err: Error, res: IResponse) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(deleteErrMsg);
                    done();
                });
        });
    });
});
