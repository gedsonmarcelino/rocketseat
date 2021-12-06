import Prismic from '@prismicio/client';
import { DefaultClient } from '@prismicio/client/types/client';
import { Console } from 'console';

export function getPrismicClient(req?: unknown): DefaultClient {
  const prismic = Prismic.client(
    process.env.PRISMIC_API_ENDPOINT ||
      process.env.NEXT_PUBLIC_PRISMIC_API_ENDPOINT,
    {
      req,
    }
  );

  return prismic;
}
