import { IsEmail, IsNotEmpty } from "class-validator"
import { User } from "./../../schema/user.schema";

export class UserProfileUpdateDto {
    @IsNotEmpty()
    full_name: string;
}
