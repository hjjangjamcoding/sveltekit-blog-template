import { getPost } from '$lib/data/posts'
/** @type {import('./$types').PageServerLoad} */
export async function load() {
 const posts = await getPost()
  return {
    posts: posts.slice(0, 5),
    // users: results
  }
}
