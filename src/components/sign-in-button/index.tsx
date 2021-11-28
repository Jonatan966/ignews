import { useState } from 'react'
import { FiX, FiGithub, FiLoader } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/client'

import styles from './styles.module.scss'

export function SignInButton() {
  const [session, isLoading] = useSession()
  const [isLoadingAuth, setIsLoadingAuth] = useState(false)

  const delayedSetIsLoadingAuthToFalse = () =>
    setTimeout(() => setIsLoadingAuth(false), 500)

  async function handleSignIn() {
    setIsLoadingAuth(true)

    try {
      await signIn('github')
    } finally {
      delayedSetIsLoadingAuthToFalse()
    }
  }

  async function handleSignOut() {
    setIsLoadingAuth(true)

    try {
      await signOut()
    } finally {
      delayedSetIsLoadingAuthToFalse()
    }
  }

  if (isLoading || isLoadingAuth) {
    return (
      <button className={styles.signInButton}>
        <FiLoader className={styles.spinnerIcon} />
      </button>
    )
  }

  if (session) {
    return (
      <button
        type="button"
        className={styles.signInButton}
        onClick={handleSignOut}
      >
        <FiGithub className={styles.githubIcon} color="var(--green-500)" />
        {session.user?.name}
        <FiX color="var(--gray-200)" className={styles.closeIcon} />
      </button>
    )
  }

  return (
    <button
      type="button"
      className={styles.signInButton}
      onClick={handleSignIn}
    >
      <FiGithub className={styles.githubIcon} color="var(--yellow-500)" />
      Sign in with Github
    </button>
  )
}
