import { User, UserSchema } from './../schema/user.schema';
import { Credential, CredentialSchema } from './../schema/credential.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Team, TeamSchema } from './../schema/team.schema';
import { PendingInvite, PendingInviteSchema } from './../schema/pendingInvite.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {name: Credential.name, schema: CredentialSchema},
      {name: Team.name, schema: TeamSchema},
      {name: User.name, schema: UserSchema},
      {name: PendingInvite.name, schema: PendingInviteSchema}
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
