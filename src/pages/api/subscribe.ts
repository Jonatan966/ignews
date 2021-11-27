import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'

import { fauna } from '../../services/fauna'
import { stripe } from '../../services/stripe'

type User = {
  ref: {
    id: string,
  },
  data: {
    cid?: string,
  },
}

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method not allowed')
  }

  const session = await getSession({ req })

  if (!session || !session.user) {
    return res.status(401)
  }

  const user = await fauna.query<User>(
    q.Get(
      q.Match(
        q.Index('user_by_email'),
        q.Casefold(String(session.user.email)),
      ),
    ),
  )

  let customerId = user.data.cid

  if (!customerId) {
    const stripeCustomer = await stripe.customers.create({
      email: String(session.user.email),
    })
  
    await fauna.query(
      q.Update(
        q.Ref(q.Collection('users'), user.ref.id),
        {
          data: {
            cid: stripeCustomer.id
          },
        },
      ),
    )

    customerId = stripeCustomer.id
  }

  const stripeCheckoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    line_items: [
      { 
        price: process.env.NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID,
        quantity: 1,
      }
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    success_url: String(process.env.STRIPE_SUCCESS_URL),
    cancel_url: String(process.env.STRIPE_CANCEL_URL),
  })

  return res.status(200).json({
    sessionId: stripeCheckoutSession.id
  })
}

export default subscribe
