"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ContactUsController_1 = require("../controller/ContactUsController");
const contactUsRouter = express_1.default.Router();
contactUsRouter.post('/createcontactmail', ContactUsController_1.sendContactMessage);
// contactUsRouter.get('/allaudios', getAllAudios);
exports.default = contactUsRouter;
