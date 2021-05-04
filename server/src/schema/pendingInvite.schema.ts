import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "./user.schema";

export type PendingInviteDocument = PendingInvite & Document;

@Schema()
export class PendingInvite{
    @Prop({ required: true })
    id: string

    @Prop({ required: true })
    team_id: string

    @Prop({ required: false })
    member: User;

    @Prop({ required: true })
    user_id: string;
}

export const PendingInviteSchema = SchemaFactory.createForClass(PendingInvite);