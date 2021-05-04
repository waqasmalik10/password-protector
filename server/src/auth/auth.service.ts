import { PendingInvite, PendingInviteDocument } from './../schema/pendingInvite.schema';
import { IUserSignUpDTO, IUserLogInDTO } from './dto/auth.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { IUserPendingInviteDTO } from 'src/user/dto/user.dto';


@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(PendingInvite.name) private pendingInviteModel: Model<PendingInviteDocument>,
    ){}

    async signup(user:IUserSignUpDTO): Promise<User> {
        const salt = await bcrypt.genSalt();
        const pass = user.password;
        user.password = await bcrypt.hash(pass, salt);
        const createdUser = new this.userModel(user);
        return await createdUser.save();
    }

    async login(user:IUserLogInDTO): Promise<User> {
        const userFound = await this.userModel.findOne({email: user.email});
        if(userFound && await bcrypt.compare(user.password, userFound.password)){
            delete userFound.password;
            return userFound;
        }
        else{
            throw new UnauthorizedException("Credentials not match");
        }
    }

    async getPendingInviteDetails(search){
        return await this.pendingInviteModel.findOne(search);
    }

    async updatePendingInviteDetails(invite:IUserPendingInviteDTO){
        return await this.pendingInviteModel.updateOne({id: invite.id}, invite);
    }
}
