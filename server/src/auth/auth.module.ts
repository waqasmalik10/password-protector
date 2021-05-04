import { PendingInvite, PendingInviteSchema } from './../schema/pendingInvite.schema';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from './../schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/schema/user.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
      {name: PendingInvite.name, schema: PendingInviteSchema}
    ]),
    JwtModule.register({
      // secret: `${process.env.JWTSECRET}`,
      secret: 'verysecretkey',
      signOptions: {expiresIn: '1h'}
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports:[
    JwtStrategy,
    PassportModule,
  ]
})
export class AuthModule {}
