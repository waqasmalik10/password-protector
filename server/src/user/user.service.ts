import { IUserCredentialDTO, IUserPendingInviteDTO, IUserTeamDTO } from './dto/user.dto';
import { Credential, CredentialDocument } from './../schema/credential.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from './../schema/team.schema';
import { User, UserDocument } from './../schema/user.schema';
import { PendingInvite, PendingInviteDocument } from 'src/schema/pendingInvite.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Credential.name) private credentialModel: Model<CredentialDocument>,
        @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(PendingInvite.name) private pendingInviteModel: Model<PendingInviteDocument>
    ){}

    async createCredential(credential:IUserCredentialDTO){
        return await this.credentialModel.create(credential);
    }

    async createCredentials(credentials:IUserCredentialDTO[]){
        return await this.credentialModel.insertMany(credentials);
    }

    async getAllCredentials(user_id:string){
        const data:IUserCredentialDTO[] = await this.credentialModel.find({user_id});
        return data;
    }

    async getAllTeams(creator_id:string){
        const data:IUserTeamDTO[] = await this.teamModel.find({creator_id});
        return data;
    }

    async createTeam(team:IUserTeamDTO){
        return await this.teamModel.create(team);
    }

    async getUserDetails(search){
        return await this.userModel.findOne(search);
    }

    async getTeamDetails(search){
        return await this.teamModel.findOne(search);
    }

    async updateTeamDetails(team:IUserTeamDTO){
        return await this.teamModel.updateOne({id: team.id}, team);
    }

    async deletePendingInvite(invite:IUserPendingInviteDTO){
        return await this.pendingInviteModel.deleteOne({id: invite.id});
    }

    async addPendingInvite(invite:IUserPendingInviteDTO){
        return await this.pendingInviteModel.create(invite);
    }

    async getPendingInviteDetails(search){
        return await this.pendingInviteModel.findOne(search);
    }

    async updateProfile(user) {
        return await this.userModel.updateOne({_id: user._id}, user);
    }
}
