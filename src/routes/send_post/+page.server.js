import { mysqlconn } from '$lib/mysql';
import { error, fail, redirect } from '@sveltejs/kit';
/** @type {import('./$types').Actions} */

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const [ip] = request.headers.get('x-forwarded-for').split(',');
        let id = await mysqlconn.query("SELECT id FROM users where uid=?", [ip], (err, rows) => {
            if (err) throw error(500, "Query Failed");
        }).then(([rows, fields]) => {
            return rows[0].id;
        });
        if (!id) {
            id = await mysqlconn.query("INSERT INTO users(uid) VALUES(?)", [ip]
            ).then(([rows2, fields2]) => {
                console.log(rows2);
                return rows2.insertId;
            })

        }
        console.log(id);
        const title = data.get('title');
        const content = data.get('content');
        await mysqlconn.query("INSERT INTO posts(title, body, user_id) VALUES (?, ?, ?)", [title, content, id], (err, rows) => {
            if (err) console.err(err);
        })
        throw redirect(302, "/");
    },
};