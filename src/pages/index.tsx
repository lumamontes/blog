import { createClient } from '../../prismicio';

import { GetStaticProps } from 'next';

import Link from 'next/link';
import styles from './home.module.scss';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Head from 'next/head';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Footer from '../components/Footer';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }) {
  const [posts, setPosts] = useState(postsPagination);

  const loadMorePosts = async () => {
    const nextPageUrl = posts.next_page;
    if (!nextPageUrl) {
      return;
    }
    const response = await fetch(nextPageUrl);
    const { results, next_page } = await response.json();
    const newPosts = results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.last_publication_date),
          'dd LLL yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });
    const newPostsWithPagination = {
      results: [...posts.results, ...newPosts],
      next_page,
    };
    setPosts(newPostsWithPagination);
  };

  return (
    <>
      <Head>
        <title>SpaceTraveling</title>
      </Head>
      <section className={styles.container}>
        <div>
          <img src={'/Logo.svg'} alt="logo" />
        </div>

        <div className={styles.posts}>
          {posts.results.map(post => (
            <Link href={`/post/${post.uid}`}>
              <div key={post.uid}>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div className={styles.info}>
                  <time>
                    <FiCalendar className={styles.icon} />
                    {post.first_publication_date}
                  </time>
                  <p>
                    <FiUser className={styles.icon} />
                    {post.data.author}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {posts.next_page && (
          <div className={styles.continueReading}>
            <a onClick={loadMorePosts}>Carregar mais posts</a>
          </div>
        )}
        <Footer />
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = createClient();
  const postsResponse = await client.getByType('post');
  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.last_publication_date),
          'dd LLL yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    }),
  };

  return {
    props: {
      postsPagination,
    },
  };
};
