import mongoose, { Schema } from "mongoose";

export interface iContactUs extends Document {
    reason : string,
    name: string;
    email: string;
    message: string;
}

const AudioSchema: Schema = new Schema({
    reason:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
})

const contactUsModel = mongoose.model<iContactUs>('contactus', AudioSchema)

export default contactUsModel


