/**
 * @param {import("../js/types").Post} post 
 * @returns {string}
 */
export const Post = (post) => {
    return /*html*/`
    <a id="post-${post.id}" >
        <a href="/posts/${post.id}">${post.title}</a>
        <p>${post.body}</p>
    </a>
    `;
}


/**
 * 
 * @param {import("../js/types").Post[]} posts 
 * @returns {string}
 */
export const PostList = (posts) => {
    return posts.map(Post).join("");
}

