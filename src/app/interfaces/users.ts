export interface IUser {
    email: string;
    password: string;
    givenName: string;
    familyName: string;
    code: string;
    preferred_username: string;
    username: string;
    attributes: {
        email: string;
        given_name: string;
        family_name: string;
        preferred_username: string;
    };
}