
import { getPost } from '$lib/data/posts'
import { error } from '@sveltejs/kit'
/** @type {import('./$types').PageServerLoad} */

export async function load({ params }) {
  const { slug } = params
  // get post with metadata
  const posts = await getPost()
  const post = posts.find((post) => parseInt(slug) === post.slug)

  if (!post) {
    throw error(404, 'Post not found')
  }
  
  return {
    post
  }
}
