import { FormEvent, useState } from 'react';
import {
  FiCalendar as IconCalendar,
  FiUser as IconAuthor,
} from 'react-icons/fi';

import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPropsResult } from 'next';
import Link from 'next/link';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';
// import commonStyles from '../styles/common.module.scss';

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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [nextPage, setNextPage] = useState(() => {
    return postsPagination.next_page
  })

  const [data, setData] = useState<Post[]>(() => {
    return postsPagination.results;
  });

  async function loadMore(event: FormEvent): Promise<void> {
    event.preventDefault();

    const response = await fetch(nextPage);
    const postsResponse = await response.json();

    const results: Post[] = postsResponse.results.map(item => {
      return {
        uid: item.uid,
        first_publication_date: item.first_publication_date,
        data: {
          title:
            item.data.title instanceof Array
              ? RichText.asText(item.data.title)
              : item.data.title,
          subtitle:
            item.data.subtitle instanceof Array
              ? RichText.asText(item.data.subtitle)
              : item.data.subtitle,
          author:
            item.data.author instanceof Array
              ? RichText.asText(item.data.author)
              : item.data.author,
        },
      };
    });
    setData([...data, ...results]);
    setNextPage(postsResponse.next_page);
  }

  return (
    <main className={styles.container}>
      {data.map(item => (
        <Link href={`/post/${item.uid}`} key={item.uid}>
          <a className={styles.post}>
            <h1>{item.data.title}</h1>
            <p>{item.data.subtitle}</p>
            <div>
              <time>
                <IconCalendar className={styles.icon} width={20} height={20} />
                {format(new Date(item.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
              <span>
                <IconAuthor className={styles.icon} width={20} height={20} />
                {item.data.author}
              </span>
            </div>
          </a>
        </Link>
      ))}

      {!!nextPage && (
        <a href="/" className={styles.loadMore} onClick={loadMore}>
          Carregar mais posts
        </a>
      )}
    </main>
  );
}

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<HomeProps>
> => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    { pageSize: process.env.PAGE_SIZE, page: 1 }
  );

  const results: Post[] = postsResponse.results.map(item => {
    return {
      uid: item.uid,
      first_publication_date: item.first_publication_date,
      data: {
        title:
          item.data.title instanceof Array
            ? RichText.asText(item.data.title)
            : item.data.title,
        subtitle:
          item.data.subtitle instanceof Array
            ? RichText.asText(item.data.subtitle)
            : item.data.subtitle,
        author:
          item.data.author instanceof Array
            ? RichText.asText(item.data.author)
            : item.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results,
      },
    },
  };
};
