import { createClient } from '../../prismicio';

import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';
import Image from 'next/image';
import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';

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

export default function Home({postWithPagination}) {
  console.log(postWithPagination)
  return (
    <section className={styles.container}>
      <div>
          <img src={'/Logo.svg'} alt='logo'/>
      </div>

      <div className={styles.posts}>
          {
            postWithPagination.results.map(post => (
                <Link href={`/posts/preview/${post.uid}`}>
                    <div key={post.uid}>
                        <h1>{post.data.title}</h1>
                        <p>{post.data.subtitle}</p>
                        <div className={styles.info}>
                          <time>
                              <FiCalendar className={styles.icon} />
                              {post.first_publication_date}
                          </time>
                          <p>
                            <FiUser className={styles.icon}/>
                            {post.data.author}
                          </p>
                        </div>
                    </div>
                </Link>
              ))
          }
      </div>
      {
        postWithPagination.next_page && (
          <div className={styles.continueReading}>
          <a> 
            Carregar mais posts
            </a>
        </div>
        )
      }
    

    </section>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  
  const client = createClient();
  const postsResponse = await client.getByType('post');
  const postWithPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date:new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author
        }
      }
    })
  }
  
  return {
    props: {
      postWithPagination, 
     }
  }
};
