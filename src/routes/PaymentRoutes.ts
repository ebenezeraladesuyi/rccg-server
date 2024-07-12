import express from "express";
import { createPaymentIntent } from "../controller/PaymentController";

const paymentRouter = express.Router();


paymentRouter.post("/create-payment-intent", createPaymentIntent);


export default paymentRouter;
