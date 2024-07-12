"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PaymentController_1 = require("../controller/PaymentController");
const paymentRouter = express_1.default.Router();
paymentRouter.post("/create-payment-intent", PaymentController_1.createPaymentIntent);
exports.default = paymentRouter;
