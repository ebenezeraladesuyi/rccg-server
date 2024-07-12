import { Request, Response } from 'express';
import stripe from "../config/stripe";




// function to create payment
export const createPaymentIntent = async (req: Request, res: Response) => {

  const {amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      // payment_method_types: ['card']
    })

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: "payment successfull"
    });

  } catch (error) {
    console.error('Error creating payment intent', error);
    res.status(500).json({error: 'failed to create payment intent'})
  }
} 


