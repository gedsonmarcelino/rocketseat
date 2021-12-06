import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { Comments } from '../../components/Comments';
import { Pagination } from '../../components/Pagination';
import { getPrismicClient } from '../../services/prismic';
import common from '../../styles/common.module.scss';
import { countTimeToRead } from '../../utils';
import styles from './post.module.scss';
import {
  FiCalendar as IconCalendar,
  FiClock as IconClock,
  FiUser as IconAuthor,
} from 'react-icons/fi';

import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

export interface Post {
  id: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  uid?: string;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <main className={styles.container}>
        <div className={common.loading}>Carregando...</div>;
      </main>
    );
  }

  return (
    <>
      <img
        className={styles.image}
        src={post.data.banner.url}
        alt={post.data.title}
      />
      <main className={styles.container}>
        <h1>{post.data.title}</h1>
        <div className={styles.info}>
          <time>
            <IconCalendar className={styles.icon} width={20} height={20} />
            {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </time>
          <span>
            <IconAuthor className={styles.icon} width={20} height={20} />
            {post.data.author}
          </span>
          <span>
            <IconClock className={styles.icon} width={20} height={20} />
            {countTimeToRead(post)} min
          </span>
        </div>

        {post.last_publication_date !== post.first_publication_date && (
          <label className={styles.editedAt}>
            {format(new Date(post.last_publication_date), "'* editado em' dd MMM yyyy, 'às' HH:mm", {
              locale: ptBR
            })}
          </label>
        )}

        <article>
          {post.data.content.map(item => (
            <div key={Math.random()}>
              <h2>
                {item.heading instanceof Array
                  ? RichText.asText(item.heading)
                  : item.heading}
              </h2>
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html:
                    item.body instanceof Array
                      ? RichText.asHtml(item.body)
                      : item.body,
                }}
              />
            </div>
          ))}

          <Pagination id={post.id} />

          <Comments id="comment" repo={process.env.NEXT_PUBLIC_REPO_NAME} />
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = async (): Promise<GetStaticPathsResult> => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
  );

  return {
    paths: posts.results.map(post => {
      return {
        params: {
          slug: post.uid,
        },
      };
    }),
    fallback: true,
  };
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<PostProps>> => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(params.slug), {});

  return {
    props: {
      post: {
        id: response.id,
        last_publication_date: response.last_publication_date,
        first_publication_date: response.first_publication_date,
        data: {
          title:
            response.data.title instanceof Array
              ? RichText.asText(response.data.title)
              : response.data.title,
          subtitle:
            response.data.subtitle instanceof Array
              ? RichText.asText(response.data.subtitle)
              : response.data.subtitle,
          banner: {
            url: response.data.banner.url,
          },
          author:
            response.data.author instanceof Array
              ? RichText.asText(response.data.author)
              : response.data.author,
          content: response.data.content,
        },
      },
    },
  };
};
