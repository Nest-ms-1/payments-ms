import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { envs } from 'src/config'
import { PaymentSessionDto } from './dto/payment-session.dto'
import { Request, Response } from 'express'

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret)

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto

    const lineItems = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const session = await this.stripe.checkout.sessions.create({
      // Colocar aqui el id de mi orden
      payment_intent_data: {
        metadata: {
          orderId: orderId,
        },
      },

      line_items: lineItems,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    })
    return session
  }

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature']

    let event: Stripe.Event
    const endPointSecret = envs.stripeEndpointSecret

    try {
      event = this.stripe.webhooks.constructEvent(req['rawBody'], sig, endPointSecret)
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`)
      return
    }

    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object
        // llamar ms
        console.log({
          metadata: chargeSucceeded.metadata,
        })
        break

      default:
        console.log(`Event type ${event.type} is not handler`)
    }

    return res.status(200).json({ sig })
  }
}