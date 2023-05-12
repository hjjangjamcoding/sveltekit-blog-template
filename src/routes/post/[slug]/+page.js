/**
 * Dynamically loads the svelte component for the post (only possible in +page.js)
 * and pass on the data from +page.server.js
 *
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load({ data }) {
  // load the markdown file based on slug
  const component = {
    html: data.post.html.innerHTML.replace(/^\s+|\s+$/g, ''),
    render: () => {
      return { html: component.html, css: { code: '', map: null }, head: '' }
    },
    $$render: () => {
      return component.html
    }
  }
  const c = await import('/workspaces/sveltekit-blog-template/posts/lorem-ipsum.md');
  // console.log(c.$$render());
  console.log(component.$$render())
  // console.log(component)
  return {
    post: data.post,
    component: c.default,
    layout: {
      fullWidth: true
    }
  }
}
