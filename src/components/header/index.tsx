import Image from 'next/image'

import { SignInButton } from '../sign-in-button'
import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image width={100} height={30} src="/images/logo.svg" alt="ig.news" />

        <nav>
          <a className={styles.active}>Home</a>
          <a>Posts</a>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}
