import { IsEmail, IsNotEmpty } from "class-validator"
import { User } from "./../../schema/user.schema";

export class IUserCredentialDTO {
    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    title: string;
    
    @IsNotEmpty()
    credential: string;
}

export class IUserTeamDTO {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    creator_id: string;

    @IsNotEmpty()
    name: string;
    
    @IsNotEmpty()
    members: User[];
}

export class IUserTeamCreateDTO {
    @IsNotEmpty()
    name: string;
}

export class IUserTeamMemeberAddDTO {
    @IsNotEmpty()
    team_id: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class IUserPendingInviteDTO {
    @IsNotEmpty()
    id: string

    @IsNotEmpty()
    team_id: string

    @IsNotEmpty()
    member: User;

    @IsNotEmpty()
    user_id: string;
}

