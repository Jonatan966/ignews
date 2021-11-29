import NextAuth from 'next-auth'
import { query as q } from 'faunadb'
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna'

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIEND_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user',
    }),
  ],
  jwt: {
    signingKey: process.env.SIGNING_KEY || '',
  },
  callbacks: {
    async session(session) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(String(session.user?.email)),
                    ),
                  ),
                ),
              ),
              q.Match(
                q.Index('subscription_by_status'),
                'active',
              ),
            ]),
          ),
        )
  
        return {
          ...session,
          activeSubscription: userActiveSubscription,
        }
      } catch {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },
    async signIn(user, account) {
      const { email } = user
      const { id } = account

      if (!email || !id) {
        throw 'Missing informations'
      }

      try {
        const matchUserQuery = q.Match(
          q.Index('user_by_gid'),
          id,
        )

        await fauna.query(
          q.If(
            q.Not(
              q.Exists(matchUserQuery),
            ),
            q.Create(
              q.Collection('users'),
              { data: { email, gid: id } },
            ),
            q.Get(matchUserQuery),
          )
        )

        return true
      } catch {
        return false
      }
    }
  },
})
 