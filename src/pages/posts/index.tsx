import { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'

import { AppHead } from '../../components/app-head'
import { getPrismicClient } from '../../services/prismic'

import styles from './styles.module.scss'

type Post = {
  slug: string,
  title: string,
  excerpt: string,
  updatedAt: string,
}

interface PostsProps {
  posts: Post[],
}

const Posts: NextPage<PostsProps> = ({ posts }) => {
  return (
    <>
      <AppHead title='Posts' />
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  const ONE_DAY = 60 * 60 * 24

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'publication'),
  ], {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100,
  })

  const posts = response.results.map<Post>(post => {
    return {
      slug: String(post.uid),
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(
        (content: { type: string }) => content.type === 'paragraph'
      )?.text ?? '',
      updatedAt: new Date(post.last_publication_date || '')
        .toLocaleDateString('pt-BR', 
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }
        ),
    }
  })

  return {
    props: {
      posts,
    },
    revalidate: ONE_DAY,
  }
}

export default Posts
