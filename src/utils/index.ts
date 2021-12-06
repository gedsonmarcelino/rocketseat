import { RichText } from 'prismic-dom';

import { Post } from '../pages/post/[slug]';

/**
 * Count a number of words in string.
 * @param text string
 * @returns number
 */
export const wordCount = (text: string): number => {
  let str = text.replace(/(^\s*)|(\s*$)/gi, '');
  str = str.replace(/[ ]{2,}/gi, ' ');
  str = str.replace(/\n /, '\n');
  return str.split(' ').length;
};

/**
 * Calculate time to read a text
 * @param post Post
 * @returns number
 */
export const countTimeToRead = (post: Post): number => {
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
