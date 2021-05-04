export interface IUserSignUpDTO {
    id?: string,
    full_name: string,
    email: string,
    password: string,
    invite?: string
}

export interface IUserLogInDTO {
    email: string,
    password: string,
}