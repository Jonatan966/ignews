import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { RichText } from 'prismic-dom'

import { AppHead } from '../../components/app-head'
import { getPrismicClient } from '../../services/prismic'

import styles from './post.module.scss'

type QueryParams = {
  slug: string,
}

interface PostProps {
  post: {
    slug: string,
    title: string,
    content: string,
    updatedAt: string,
  },
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <AppHead title={post.title} />

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<PostProps, QueryParams> = 
  async ({ req, params }) => {
    const session = await getSession({ req })
    const slug = String(params?.slug)

    if (!session?.activeSubscription) {
      return {
        redirect: {
          destination: `/posts/preview/${slug}`,
          permanent: false,
        },
      }
    }

    const prismic = getPrismicClient(req)

    const response = await prismic.getByUID('publication', slug, {})

    const post: PostProps['post'] = {
      slug,
      title: RichText.asText(response.data.title),
      content: RichText.asHtml(response.data.content),
      updatedAt: new Date(response.last_publication_date || '')
        .toLocaleDateString('pt-BR', 
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }
        ),
    }

    return {
      props: { post },
    }
  }
