import { FC } from 'react'
import Head from 'next/head'

interface AppHeadProps {
  title: string,
}

export const AppHead: FC<AppHeadProps> = ({ children, title }) => {
  return (
    <Head>
      <title>{title} | ig.news</title>
      {children}
    </Head>
  )
}
