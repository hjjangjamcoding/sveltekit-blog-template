import { posts } from '$lib/data/posts'
/** @type {import('./$types').PageServerLoad} */
export async function load() {
  // let results = await mysqlconn.query("SELECT * FROM users WHERE id=")
  // .then(([rows, fields]) => {
  //     console.log(rows);
  //     return rows;
  // })
  // console.log(posts);
  return {
    posts: posts.slice(0, 5),
    // users: results
  }
}
