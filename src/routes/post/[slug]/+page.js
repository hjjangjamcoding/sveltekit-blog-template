/**
 * Dynamically loads the svelte component for the post (only possible in +page.js)
 * and pass on the data from +page.server.js
 *
 * @type {import('@sveltejs/kit').PageLoad}
 */

export async function load({ data }) {
  const html = data.post.html
  const component = {
    // html: ,
    render: () => {
      return { html:html, css: { code: '', map: null }, head: '' }
    },
    $$render: () => {
      return html
    }
  }
  return {
    post: data.post,
    component,
    layout: {
      fullWidth: true
    }
  }
}
