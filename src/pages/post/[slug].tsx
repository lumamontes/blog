import { asHTML, asText } from '@prismicio/helpers';
import { createClient } from '../../../prismicio';
import Header from '../../components/Header';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Footer from '../../components/Footer';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    reading_time?: number;
    content: {
      heading: string;
      body: [];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  if (router.isFallback) {
    return <p>Carregando...</p>;
  }
  return (
    <>
      <Head>
        <title>{post.data.title} | SpaceTraveling</title>
      </Head>
      <Header />
      <section className={styles.container}>
        <div>
          <img src={post.data.banner.url} alt={post.data.title} />
        </div>
        <article>
          <h1>{post.data.title}</h1>
          <div className={styles.info}>
            <time>
              <FiCalendar className={styles.icon} />
              {post.first_publication_date}
            </time>
            <p>
              <FiUser className={styles.icon} />
              {post.data.author}
            </p>
            <p>
              <FiClock className={styles.icon} />
              {post.data.reading_time} min
            </p>
          </div>

          <div className={styles.postBody}>
            {post.data.content.map(({ heading, body }) => {
              return (
                <div key={heading}>
                  <h2>{heading}</h2>
                  <div dangerouslySetInnerHTML={{ __html: asHTML(body) }} />
                </div>
              );
            })}
          </div>
        </article>
        <Footer />
      </section>
    </>
  );
}
export const getStaticPaths = async () => {
  const prismic = createClient();
  const posts = await prismic.getByType('post');

  const paths = posts.results.map(post => {
    return {
      params: { slug: post.uid },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = createClient();
  const response = await prismic.getByUID('post', String(slug));

  function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const totalWords = content.reduce((acc, section) => {
      const headingWords = section.heading
        ? section.heading.split(/\s+/).length
        : 0;
      const bodyText = asText(section.body);
      const bodyWords = bodyText ? bodyText.split(/\s+/).length : 0;
      return acc + headingWords + bodyWords;
    }, 0);
    const minutes = Math.ceil(totalWords / wordsPerMinute);
    return minutes;
  }

  const post = {
    uid: response.uid,
    first_publication_date: format(
      new Date(response.last_publication_date),
      'dd LLL yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      reading_time: calculateReadingTime(response.data.content[0].body),
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: content.body,
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
  };
};
