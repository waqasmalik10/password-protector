import { IUserCredentialDTO, IUserPendingInviteDTO, IUserTeamCreateDTO, IUserTeamDTO, IUserTeamMemeberAddDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe, Body, NotFoundException, ConflictException, Param, InternalServerErrorException, BadRequestException, Redirect } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/schema/user.schema';
import { Team } from 'src/schema/team.schema';
import { UserProfileUpdateDto } from './dto/updateProfile.dto';
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail')

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ){
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    }

    @Post('saveCredential')
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    async saveCredential(@Req() req){
        const user:User = req.user;
        const body:IUserCredentialDTO = {...req.body};

        return await this.userService.createCredential({...body, user_id: user.id});    
    }

    @Post('shareCredential')
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    async shareCredential(@Req() req){
        const user:User = req.user;
        const body:IUserCredentialDTO[] = typeof req.body.credentialToShare === 'string' ? JSON.parse(req.body.credentialToShare) : req.body.credentialToShare;
        console.log(body)

        return await this.userService.createCredentials(body);    
    }

    @Get('getAllCredentials')
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    async getAllCredentials(@Req() req): Promise<IUserCredentialDTO[]>{
        const user:User = req.user;

        const res:IUserCredentialDTO[] = await this.userService.getAllCredentials(user.id);
        return res; 
    }

    @Post('createTeam')
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    async createTeam(@Req() req){
        const user:User = req.user;
        const body:IUserTeamCreateDTO = {...req.body};

        const team: IUserTeamDTO = {
            name: body.name,
            id: uuid.v1(),
            creator_id: user.id,
            members: []
        }
        
        return await this.userService.createTeam(team);    
    }

    @Get('getAllTeams')
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    async getAllTeams(@Req() req): Promise<IUserTeamDTO[]>{
        const user:User = req.user;

        const res:IUserTeamDTO[] = await this.userService.getAllTeams(user.id);
        return res; 
    }

    @Get('verify/:id')
    @Redirect(process.env.FRONT_END_BASE_URL+'login?verification=completed', 302)
    async verifyInvitation(@Param('id') id:string){
        const pendingInvite: IUserPendingInviteDTO = await this.userService.getPendingInviteDetails({id});
        if(!pendingInvite) throw new NotFoundException('Invitation do not exist');
        
        let teamDetails:IUserTeamDTO = await this.userService.getTeamDetails({id: pendingInvite.team_id});
        if(!teamDetails) throw new NotFoundException('Team do not exist');

        teamDetails.members.push(pendingInvite.member);
        const updatedData = await this.userService.updateTeamDetails(teamDetails);
        if(updatedData) {
            await this.userService.deletePendingInvite(pendingInvite);
            return {
                "url": process.env.FRONT_END_BASE_URL+'login?message=Invitation Accepted Successfully',
                "statusCode": 302
              };
        }
        else throw new InternalServerErrorException('Something went wrong. try again');
    }

    @Post('sendInvitation')
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    async sendInvitation(@Req() req){
        const user:User = req.user;
        const body:IUserTeamMemeberAddDTO = {...req.body};

        const invited_user:User = await this.userService.getUserDetails({email: body.email});

        const team:Team = await this.userService.getTeamDetails({id: body.team_id});
        if(!team) throw new NotFoundException('Requested team do not exist');

        if(team.members.find((t) => t.id === invited_user.id)) throw new BadRequestException('Requested user already exist in team');

        const pendingInvite: IUserPendingInviteDTO = await this.userService.getPendingInviteDetails({team_id: body.team_id, member: invited_user});
        if(pendingInvite) throw new ConflictException('Already has pending invite');

        const invite: IUserPendingInviteDTO = {
            id: uuid.v1(),
            team_id: body.team_id,
            user_id: user.id,
            member: invited_user || null
        }

        const res = await this.userService.addPendingInvite(invite);
        if(res) {
            const message = invited_user ? `
                ${user.full_name} has invited you to join his team. <a href='http://localhost:8080/user/verify/${res.id}'>Click to verify your approval</a>
            ` : `
                ${user.full_name} has invited you to join his team. <a href='${process.env.FRONT_END_BASE_URL}signup?invite=${res.id}'>Click to signup and verify your approval</a>
            `;
            this.sendEmail(body.email, "Invitation From "+user.full_name, message);
        }

        return res;
    }



    @Get('get-profile')
    @UseGuards(AuthGuard())
    getProfile(@Req() req) {
        const user: User = {...req.user._doc};
        delete user.password;
        return user;
    }


    @Post('update-profile')
    @UseGuards( AuthGuard() )
    async updateProfile(@Req() req, @Body() userProfileUpdatedDto: UserProfileUpdateDto) {
        const user: User = req.user;
        user.full_name = userProfileUpdatedDto.full_name;
        return await this.userService.updateProfile(user);
    }



    sendEmail(to: string, subject: string, message: string){
        const msg = {
            to,
            from: process.env.SEND_EMAIL_FROM,
            subject,
            text: message,
            html: message,
        };
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })
    }

}