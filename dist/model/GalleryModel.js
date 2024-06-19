"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const carSchema = new mongoose_1.default.Schema({
    rccgGallImage: {
        type: String,
        // required: [true, "please, upload image"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const galleryModel = mongoose_1.default.model("rccgImage", carSchema);
exports.default = galleryModel;
