import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'

import styles from './styles.module.scss'

export function SubscribeButton() {
  const [session] = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    if (session.activeSubscription) {
      router.push('/posts')

      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      const typedError = error as Error
      alert(typedError.message)
    }
  }

  // if (session?.activeSubscription) {
  //   return (
  //     <button
  //       type='button'
  //       className={`${styles.subscribeButton} ${styles.cancelButton}`}
  //     >
  //       Cancel subscription
  //     </button>
  //   )
  // }

  return (
    <button
      onClick={handleSubscribe}
      type="button"
      className={styles.subscribeButton}
    >
      Subscribe now
    </button>
  )
}
