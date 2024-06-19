"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FirstTimercontroller_1 = require("../controller/FirstTimercontroller");
const firstTimerRouter = express_1.default.Router();
firstTimerRouter.post("/registerfirst", FirstTimercontroller_1.registerFirstTimer);
firstTimerRouter.get("/allfirsttimers", FirstTimercontroller_1.getAllFirstTimers);
exports.default = firstTimerRouter;
