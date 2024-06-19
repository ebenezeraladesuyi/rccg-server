"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// import {uri} from "../../link";
dotenv_1.default.config();
const uri = process.env.MONGOOSE_DB;
if (!uri) {
    console.error("MONGOOSE_DB environment variable is not defined.");
    process.exit(1); // Exit the process or handle the error appropriately
}
const dbConfig = async () => {
    try {
        const con = await mongoose_1.default.connect(uri);
        console.log(`connected to database on port ${con.connection.host}`);
    }
    catch (error) {
        console.log(`failed to connect to database`, error);
    }
};
exports.default = dbConfig;
