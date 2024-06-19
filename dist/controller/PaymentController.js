"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPayment = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeClient = new stripe_1.default(stripeSecretKey);
// POST /api/payment - Process payment with Stripe
const processPayment = async (req, res) => {
    try {
        const { amount, currency, token } = req.body;
        // Create a charge using the token received from the client
        const charge = await stripeClient.charges.create({
            amount,
            currency,
            source: token.id,
            description: 'Online offering for church', // Customize as needed
        });
        // Optionally, save the charge details to your database
        res.status(200).json({ message: 'Payment successful', charge });
    }
    catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.processPayment = processPayment;
