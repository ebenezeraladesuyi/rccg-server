import mongoose, { Schema } from "mongoose";

export interface iContactUs extends Document {
    reason: string;
    firstName : string,
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
}

const contactSchema: Schema = new Schema({
    reason:{
        type: String,
        required: true,
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    phoneNumber:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
})

const contactUsModel = mongoose.model<iContactUs>('rccgcontactus', contactSchema)

export default contactUsModel


