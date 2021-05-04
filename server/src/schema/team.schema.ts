import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "./user.schema";

export type TeamDocument = Team & Document;

@Schema()
export class Team{
    @Prop({ required: true })
    id: string

    @Prop({ required: true })
    creator_id: string

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    members: User[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);