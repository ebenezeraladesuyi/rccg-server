import mongoose from "mongoose";

interface gall {
    rccgGallImage: string | null;
    createdAt: Date;
}

interface iGallery extends gall, mongoose.Document {}

const carSchema = new mongoose.Schema({
    rccgGallImage: {
        type: String,
        // required: [true, "please, upload image"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const galleryModel = mongoose.model<iGallery>("rccgImage", carSchema);

export default galleryModel;
