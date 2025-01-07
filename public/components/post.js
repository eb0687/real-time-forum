/**
 * @param {import("../js/types").Post} post
 * @returns {string}
 */
export const Post = (post) => {
  return /*html*/ `
<link rel="stylesheet" href="/public/css/home.css">
<div id="post-container" class="">
  <a id="post-${post.id}">
    <div id="post-title-container" class="">
      <div id="post-details" class="">
        <i class="fa-regular fa-user"></i>
        <p>${post.nickname}</p>
      </div>
      <a class="post-title" href="/posts/${post.id}">${post.title}</a>
    </div>
    <p class="post-body">
      ${post.body}
    </p>
  </a>
</div>
    `;
};

/**
 *
 * @param {import("../js/types").Post[]} posts
 * @returns {string}
 */
export const PostList = (posts) => {
  if (!posts) return "";
  return posts.map(Post).join("");
};
