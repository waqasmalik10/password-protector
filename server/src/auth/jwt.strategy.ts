import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User, UserDocument } from 'src/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWTSECRET
        });
    }

    async validate(payload){
        const user = await this.userModel.findOne({id: payload.id});
        if(!user) throw new UnauthorizedException('You are unthorized');
        return user;
    }
}