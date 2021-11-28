import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import { SignInButton } from '../sign-in-button'
import styles from './styles.module.scss'

export function Header() {
  const route = useRouter()

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image width={100} height={30} src="/images/logo.svg" alt="ig.news" />

        <nav>
          <Link href='/'>
            <a className={route.pathname === '/' ? styles.active : ''}>
              Home
            </a>
          </Link>
          <Link href='/posts'>
            <a className={route.pathname.includes('/posts') ? styles.active : ''}>
              Posts
            </a>
          </Link>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}
