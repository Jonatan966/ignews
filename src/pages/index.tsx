import type { NextPage } from 'next'
import Image from 'next/image'
import { SubscribeButton } from '../components/subscribe-button'

import styles from './home.module.scss'

const Home: NextPage = () => {
  return (
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👏 Hey, welcome</span>
        <h1>News about the <span>React</span> world.</h1>
        <p>
          Get access to all the publications <br />
          <span>for $9.90 month</span>
        </p>
        <SubscribeButton />
      </section>

      <Image width={336} height={521} src="/images/avatar.svg" alt="Girl coding" />
    </main>
  )
}

export default Home
