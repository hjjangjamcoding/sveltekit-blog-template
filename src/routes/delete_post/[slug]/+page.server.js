import { error, redirect } from '@sveltejs/kit'
import { mysqlconn } from "$lib/mysql"
/** @type {import('./$types').PageServerLoad} */

export async function load({ params }) {
  const { slug } = params
  mysqlconn.query("DELETE FROM posts WHERE id=?", [slug], (err, result) => {
    if(err) throw error(404, "Post cannot delete");
    console.log(result);
  })
  // get post with metadata
  

  
  throw redirect(302, "/")
}
