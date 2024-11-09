/**
 * @param {import("../js/types").Comment} comment
 * @returns {string}
 */
export const Comment = (comment) => {
  return /*html*/ `
    <a id="comment-${comment.id}" >
        <p>body: ${comment.body}</p>
        <p>id: ${comment.id}</p>
        <p>created: ${comment.created_at.Time}</p>
        <p>userid: ${comment.userid}</p>
        <p>postid: ${comment.postid}</p>
    </a>
    `;
};

/**
 *
 * @param {import("../js/types").Comment[]} comments
 * @returns {string}
 */
export const CommentList = (comments) => {
  if (!comments || comments.length === 0) return "";
  return comments.map(Comment).join("");
};
