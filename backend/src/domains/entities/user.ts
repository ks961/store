

export class User {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public roleId: string,
        public address: string,
        public hashedPassword?: string
    ) {};
}