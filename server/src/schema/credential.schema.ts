import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CredentialDocument = Credential & Document;

@Schema()
export class Credential{
    @Prop({ required: true })
    user_id: string

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    credential: string;
}

export const CredentialSchema = SchemaFactory.createForClass(Credential);