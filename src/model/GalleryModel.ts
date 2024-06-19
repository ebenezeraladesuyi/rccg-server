import mongoose from "mongoose";

interface gall {
    gacImage: string | null;
    createdAt: Date;
}

interface iGallery extends gall, mongoose.Document {}

const carSchema = new mongoose.Schema({
    gacImage: {
        type: String,
        // required: [true, "please, upload image"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const galleryModel = mongoose.model<iGallery>("gacImage", carSchema);

export default galleryModel;
