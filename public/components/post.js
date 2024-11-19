/**
 * @param {import("../js/types").Post} post
 * @returns {string}
 */
export const Post = (post) => {
  return /*html*/ `

<div id="post-container" class="b-3px-border p-10px rounded">
  <a id="post-${post.id}">
    <div id="post-title-container" class="flex flex-row justify-start w-100% items-center">
      <i class="fa-sharp fa-solid fa-comment"></i>
      <a class="post-title" href="/posts/${post.id}">${post.title}</a>
    </div>
    <p class="post-body">
      ${post.body}
    </p>
  </a>
</div>



<style>
  #post-container {
    flex: 1 1 100px;
    min-width: 300px;
    min-height: 300px;
    border: solid white;
    transition: background-color 0.3s ease;
  }
  #post-container:hover {
    background-color: #2b2f31;
  }
  #post-title-container {
    text-align-center;
    border-bottom: 1px solid white
  } 
  #post-container:hover #post-title-container {
    border-bottom-color: black;
  }
  .post-title {
    padding: 10px;
    font-size: 1.5rem;
    font-weight: bold;
    min-height: 50px;
    text-decoration: none;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: border-color 0.3s ease;
  }
  .post-title:hover {
    color: #ddd;
  }

  .post-body {
    padding: 10px;
    font-size: 1.2rem;
    max-height: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

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
