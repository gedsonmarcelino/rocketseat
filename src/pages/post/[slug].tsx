import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import { wordCount } from '../../utils';
import styles from './post.module.scss';
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import {
  FiCalendar as IconCalendar,
  FiClock as IconClock,
  FiUser as IconAuthor,
} from 'react-icons/fi';

interface Post {
  first_publication_date: string | null;
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

const countTimeToRead = (post: Post): number => {
  let count = 0;

  post.data.content.forEach(item => {
    count += wordCount(
      item.heading instanceof Array
        ? RichText.asText(item.heading)
        : item.heading
    );
    count += wordCount(
      item.body instanceof Array ? RichText.asHtml(item.body) : item.body
    );
  });

  return Math.ceil(count / 200);
};

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
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

        <article>
          {post.data.content.map(item => (
            <div key={Math.random()}>
              <h2>
                {item.heading instanceof Array
                  ? RichText.asText(item.heading)
                  : item.heading}
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    item.body instanceof Array
                      ? RichText.asHtml(item.body)
                      : item.body,
                }}
              />
            </div>
          ))}
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
        uid: response.uid,
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
