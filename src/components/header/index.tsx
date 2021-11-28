import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import { SignInButton } from '../sign-in-button'
import styles from './styles.module.scss'
import { ActiveLink } from '../active-link'

export function Header() {
  const route = useRouter()

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image width={100} height={30} src="/images/logo.svg" alt="ig.news" />

        <nav>
          <ActiveLink activeClassName={styles.active} href='/'>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href='/posts'>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}
