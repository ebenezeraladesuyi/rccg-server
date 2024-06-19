"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SwysSubscribeContoller_1 = require("../controller/SwysSubscribeContoller");
const swysSubscribeRouter = express_1.default.Router();
swysSubscribeRouter.get("/allsubscribed", SwysSubscribeContoller_1.getAllSubscribed);
swysSubscribeRouter.post("/usersubscribe", SwysSubscribeContoller_1.userSubscribe);
exports.default = swysSubscribeRouter;
