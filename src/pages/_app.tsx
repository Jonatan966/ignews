import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import { Provider as NextAuthProvider } from 'next-auth/client'

import { Header } from '../components/header'

import '../styles/global.scss'

interface MyAppProps<T = any> extends AppProps<T> {
  pageProps: {
    session?: Session,
  },
}

function MyApp({ Component, pageProps }: MyAppProps<MyAppProps["pageProps"]>) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp
