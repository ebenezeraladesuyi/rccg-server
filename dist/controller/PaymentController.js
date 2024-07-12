"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("../config/stripe"));
// function to create payment
const createPaymentIntent = async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe_1.default.paymentIntents.create({
            amount,
            currency: 'eur',
            // payment_method_types: ['card']
        });
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            message: "payment successfull"
        });
    }
    catch (error) {
        console.error('Error creating payment intent', error);
        res.status(500).json({ error: 'failed to create payment intent' });
    }
};
exports.createPaymentIntent = createPaymentIntent;
