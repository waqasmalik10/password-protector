import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { IUserLogInDTO, IUserSignUpDTO } from './dto/auth.dto';
import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { IUserPendingInviteDTO } from 'src/user/dto/user.dto';
var uuid = require('uuid');

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private jwtService: JwtService
    ){}


    @Post('signup')
    async signUp(@Body() user:IUserSignUpDTO) {
        user.id = uuid.v1();
        const u = await this.authService.signup(user);
        const jwt = await this.jwtService.signAsync({id: u.id})

        // if user is invited
        if(user.invite){
            let invite: IUserPendingInviteDTO = await this.authService.getPendingInviteDetails({id: user.invite});
            if(invite){
                invite.member = u;
            }
            await this.authService.updatePendingInviteDetails(invite);
        }
        return jwt;
    }

    @Post('login')
    async login(@Body() user:IUserLogInDTO) {
        const u = await this.authService.login(user);
        const jwt = await this.jwtService.signAsync({id: u.id})
        return jwt;
    }


}
