import { browser } from '$app/environment'
import { format } from 'date-fns'
import { parse } from 'node-html-parser'
import readingTime from 'reading-time/lib/reading-time.js'
import { marked } from 'marked'
import { mysqlconn } from "$lib/mysql"
const leftPad = (value) => {
  if (value >= 10) {
    return value;
  }

  return `0${value}`;
}
const toStringDate = (source, delimiter = '-') => {
  const year = source.getFullYear();
  const month = leftPad(source.getMonth() + 1);
  const day = leftPad(source.getDate());

  return [year, month, day].join(delimiter);
}
// we require some server-side APIs to parse all metadata
if (browser) {
  throw new Error(`posts can only be imported server-side`)
}
marked.setOptions(
  {
    renderer: new marked.Renderer(),
    gfm: true,
    headerIds: false,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  }
)
export const getPost = async () => {
  return mysqlconn.query("SELECT * FROM posts ORDER BY created_at DESC")
  .then(([rows, fields]) => {
    return rows.map(post => {
      const html = parse(marked(post.body))
      const preview = html.firstChild
      return {
        title: post.title,
        date: toStringDate(post.created_at),
        html: html.innerHTML,
        slug: post.id,
        isIndexFile: post.id === 1,
        preview: {
          html: preview.toString(),
          // text-only preview (i.e no html elements), used for SEO
          text: preview.structuredText ?? preview.toString()
        },
        readingTime: readingTime(html.structuredText).text,
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      // add references to the next/previous post
      .map((post, index, allPosts) => ({
        ...post,
        next: allPosts[index - 1],
        previous: allPosts[index + 1],
      }))
  })
}
// Get all posts and add metadata
// console.log(posts);

// export const posts = Object.entries(import.meta.glob('/posts/**/*.md', { eager: true }))
//   .map(([filepath, post]) => {
//     const html = parse(parse(post.default.render().html))
//     const preview = post.metadata.preview ? parse(post.metadata.preview) : html.querySelector('p')
//     // console.log(html);
//     // console.log(post.metadata)
//     return {
//       ...post.metadata,

//       // generate the slug from the file path
//       slug: filepath
//         .replace(/(\/index)?\.md/, '')
//         .split('/')
//         .pop(),

//       // whether or not this file is `my-post.md` or `my-post/index.md`
//       // (needed to do correct dynamic import in posts/[slug].svelte)
//       isIndexFile: filepath.endsWith('/index.md'),

//       // format date as yyyy-MM-dd
//       date: post.metadata.date
//         ? format(
//           // offset by timezone so that the date is correct
//           addTimezoneOffset(new Date(post.metadata.date)),
//           'yyyy-MM-dd'
//         )
//         : undefined,

//       preview: {
//         html: preview.toString(),
//         // text-only preview (i.e no html elements), used for SEO
//         text: preview.structuredText ?? preview.toString()
//       },

//       // get estimated reading time for the post
//       readingTime: readingTime(html.structuredText).text
//     }
//   })
//   // sort by date
//   .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//   // add references to the next/previous post
//   .map((post, index, allPosts) => ({
//     ...post,
//     next: allPosts[index - 1],
//     previous: allPosts[index + 1]
//   }))

function addTimezoneOffset(date) {
  const offsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000
  return new Date(new Date(date).getTime() + offsetInMilliseconds)
}
