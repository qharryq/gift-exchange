"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Member {
    constructor(nameOrMember, email, id) {
        if (typeof nameOrMember === 'string') {
            this.name = nameOrMember;
            this.email = email || '';
            this.id = id || -1;
        }
        else {
            this.name = nameOrMember.name;
            this.email = nameOrMember.email;
            this.id = nameOrMember.id;
        }
    }
}
exports.default = Member;
