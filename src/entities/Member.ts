export interface IMember {
    id: string;
    name: string;
    email: string;
}

class Member implements IMember {

    public id: string;
    public name: string;
    public email: string;

    constructor(id: string, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

export default Member;