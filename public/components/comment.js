/**
 * @param {import("../js/types").Comment} comment
 * @returns {string}
 */

export const Comment = (comment) => {
  const commentCreatedDate = new Date(comment.created_at.Time).toLocaleString();
  return /*html*/ `
<link rel="stylesheet" href="/public/css/post.css">
<div class="comment-content" id="comment-${comment.id}" data-userid="${comment.userid}")>
    <div id="comment-container" class="flex flex-row pb-10px justify-start">
      <div id="comment-details-container" class="w-20%">
        <p>username: ${comment.username}</p>
        <p>id: ${comment.id}</p>
        <p>created: ${commentCreatedDate}</p>
        <p>userid: ${comment.userid}</p>
        <p>postid: ${comment.postid}</p>
      </div>
      <div id="comment-body-container" class="w-100% p-10px">
        ${comment.body}
      </div>
      <div id="comment-buttons-container" class="flex flex-row gap-10px items-end">
        <button class="edit-comment" data-comment-id="${comment.id}">Edit</button>
        <button class="delete-comment" data-comment-id="${comment.id}">Delete</button>
      </div>
      <div class="edit-form" id="edit-form-${comment.id}" >
        <textarea class="edit-textarea" id="edit-textarea-${comment.id}">${comment.body}</textarea>
        <div id="edit-form-buttons-container" class="flex flex-row gap-10px items-end">
          <button class="save-comment" data-comment-id="${comment.id}">Save</button>
          <button class="cancel-edit" data-comment-id="${comment.id}">Cancel</button>
        </div>
      </div>
    </div>
</div>

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
