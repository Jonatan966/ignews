import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'

import { stripe } from '../services/stripe'
import { SubscribeButton } from '../components/subscribe-button'

import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string,
    amount: string,
  },
}

const Home: NextPage<HomeProps> = ({ product }) => {
  return (
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👏 Hey, welcome</span>
        <h1>News about the <span>React</span> world.</h1>
        <p>
          Get access to all the publications <br />
          <span>for {product.amount} month</span>
        </p>
        <SubscribeButton priceId={product.priceId} />
      </section>

      <Image
        width={336}
        height={521}
        src="/images/avatar.svg"
        alt="Girl coding"
      />
    </main>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const ONE_DAY = 60 * 60 * 24
  const price = await stripe.prices.retrieve(
    `${process.env.NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID}`
  )

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US',
      {
        style: 'currency',
        currency: 'USD'
      }
    ).format((price.unit_amount ?? 0) / 100),
  }

  return {
    props: {
      product
    },
    revalidate: ONE_DAY
  }
}

export default Home
