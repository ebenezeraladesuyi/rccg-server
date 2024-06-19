import { Request, Response } from 'express';
import stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const stripeClient = new stripe(stripeSecretKey);

// POST /api/payment - Process payment with Stripe
export const processPayment = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error : any) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: error.message });
  }
};
