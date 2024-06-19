"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
const blogSchema = new mongoose_1.default.Schema({
    blogImage: {
        type: String,
        required: [true, "please, upload image"]
    },
    author: {
        type: String,
        required: [true, "please, input author"]
    },
    title: {
        type: String,
        required: [true, "please, input title"]
    },
    details: {
        type: String,
        required: [true, "please, input details"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.blogModel = mongoose_1.default.model("blogs", blogSchema);
