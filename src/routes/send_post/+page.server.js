import { mysqlconn } from '$lib/mysql';
import { fail, redirect } from '@sveltejs/kit';
/** @type {import('./$types').Actions} */

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const title = data.get('title')
        const content = data.get('content')
        mysqlconn.query("INSERT INTO posts(title, body, user_id) VALUES (?, ?, ?)", [title, content, 1], (err, rows) => {
            if(err) console.err(err);
        })
        throw redirect(302, "/")
    },
};