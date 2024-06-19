"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const firstTimerSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
    },
    address: {
        type: String,
        required: [true, "please enter your address"],
    },
    county: {
        type: String,
        required: [true, "please enter your county"],
    },
    occupation: {
        type: String,
        required: [true, "please enter your occupation"],
    },
    telHome: {
        type: String,
        required: [false, "please enter your home telephone"],
    },
    telWork: {
        type: String,
        required: [false, "please enter your work telephone"],
    },
    mobile: {
        type: String,
        required: [false, "please enter your mobile"],
    },
    visitOrStay: {
        type: String,
        required: [true, "please enter if you're visiting or staying"],
    },
    prayerRequest: {
        type: String,
        required: [false, "please enter your prayer request"],
    },
    haveJesus: {
        type: String,
        required: [true, "do you have Jesus as your savior?"],
    },
    pastorVisit: {
        type: String,
        required: [true, "do you eant a pastor/counsellor to visit you?"],
    },
});
const firstTimerModel = mongoose_1.default.model("rccgFirstTimer", firstTimerSchema);
exports.default = firstTimerModel;
