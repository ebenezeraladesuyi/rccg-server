"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SermonController_1 = require("../controller/SermonController");
const multer_1 = __importDefault(require("../config/multer"));
const audioRouter = express_1.default.Router();
audioRouter.post('/uploadaudio', multer_1.default, SermonController_1.createAudio);
audioRouter.get('/allaudios', SermonController_1.getAllAudios);
audioRouter.get('/getoneaudio/:id', SermonController_1.getAudioById);
exports.default = audioRouter;
