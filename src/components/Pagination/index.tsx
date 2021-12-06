import Prismic from '@prismicio/client';
import { useEffect, useState } from 'react';
import { getPrismicClient } from '../../services/prismic';
import styles from './pagination.module.scss';
import Link from 'next/link';
import { RichText } from 'prismic-dom';

interface PaginationProps {
  id: string
}

interface ResponsePaginate {
  prev: {
    slug: string,
    text: string
  } | null;
  next: {
    slug: string,
    text: string
  } | null;
}

export const Pagination = ({ id }: PaginationProps) => {

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<ResponsePaginate>({
    prev: null,
    next: null
  })

  useEffect(() => {
    loadPages(id)
  }, [id])

  async function loadPages(id: string) {
    setLoading(true)
    const prismic = getPrismicClient();

    const prev = await prismic.query(
      Prismic.Predicates.at('document.type', 'posts'),
      {
        pageSize: 1,
        after: id,
        orderings: '[document.first_publication_date]'
      }
    );

    const next = await prismic.query(
      Prismic.Predicates.at('document.type', 'posts'),
      {
        pageSize: 1,
        after: id,
        orderings: '[document.first_publication_date desc]'
      }
    );

    setPage({
      prev: prev.results.length > 0 ? {
        slug: prev.results[0].uid,
        text: RichText.asText(prev.results[0].data.title)
      } : null,
      next: next.results.length > 0 ? {
        slug: next.results[0].uid,
        text: RichText.asText(next.results[0].data.title)
      } : null,
    })
    setLoading(false)
  }

  if (loading) return <p>Carrengando...</p>

  return (
    <div className={styles.pagination}>
      {page.prev && (
        <Link href={`/post/${page.prev.slug}`}>
          <a className={styles.prev}>
            <span className={styles.title}>{page.prev.text}</span>
            <span className={styles.subtitle}>Post anterior</span>
          </a>
        </Link>
      )}
      {page.next && (
        <Link href={`/post/${page.next.slug}`}>
          <a className={styles.next}>
            <span className={styles.title}>{page.next.text}</span>
            <span className={styles.subtitle}>Próximo post</span>
          </a>
        </Link>
      )}
    </div>
  )
}