import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe'

import { stripe } from '../../services/stripe'
import { saveSubscription } from './_lib/manage-subscription'

async function buffer(readable: Readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    )
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

const webhooks = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method not allowed')
  }

  const buf = await buffer(req)
  const secret = String(req.headers['stripe-signature'])
  
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      buf, 
      secret, 
      String(process.env.STRIPE_WEBHOOK_SECRET)
    )
  } catch (error) {
    const typedError = error as Error
    
    return res.status(400).send(`Webhook error: ${typedError.message}`)
  }

  const { type } = event

  if (relevantEvents.has(type)) {
    try {
      switch (type) {
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session
          await saveSubscription(
            String(checkoutSession.subscription),
            String(checkoutSession.customer),
            true,
          )
          break

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription

          await saveSubscription(
            subscription.id,
            String(subscription.customer),
            false,
          ) 
          break
        default:
          throw new Error('Unhandled event.')
      }
    } catch (err) {
      return res.json({ error: 'Webhook handler failed.' })
    }
  }

  res.json({ received: true })
}

export default webhooks