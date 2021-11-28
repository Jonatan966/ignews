import { useState } from 'react'
import Image from 'next/image'
import { FiMenu, FiX } from 'react-icons/fi'

import { SignInButton } from '../sign-in-button'
import { ActiveLink } from '../active-link'

import styles from './styles.module.scss'

export function Header() {
  const [isOpenedMenu, setIsOpenedMenu] = useState(false)

  return (
    <header className={styles.headerContainer}>
      <div className={`${styles.headerContent} ${!isOpenedMenu ? styles.hiddenMenu : ''}`}>
        <div className={styles.mobileContainer}>
          <div className={styles.imageContainer}>
            <Image
              layout='fill'
              src="/images/logo.svg"
              alt="ig.news"
            />
          </div>
          
          <button type='button' onClick={() => setIsOpenedMenu(!isOpenedMenu)}>
              {isOpenedMenu ? (
                <FiX size='3rem' color='var(--white)' />
              ) : (
                <FiMenu size='3rem' color='var(--white)' />
              )}
          </button>
        </div>

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
