import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export function SignInButton() {
  const isUserLoggedIn = true;

  if (isUserLoggedIn) {
    return (
      <button type="button" className={styles.signInButton}>
        <FaGithub color="var(--green-500)" />
        Jonatan Frederico
        <FiX color="var(--gray-200)" className={styles.closeIcon} />
      </button>
    )
  }

  return (
    <button type="button" className={styles.signInButton}>
      <FaGithub color="var(--yellow-500)" />
      Sign in with Github
    </button>
  )
}
