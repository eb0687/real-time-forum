/**
 * @param {import("../js/types").Comment} comment
 * @returns {string}
 */
export const Comment = (comment) => {
  return /*html*/ `
    <div class="comment-container">
        <div class="comment-content" id="comment-${comment.id}">
            <p>body: ${comment.body}</p>
            <p>id: ${comment.id}</p>
            <p>created: ${comment.created_at.Time}</p>
            <p>userid: ${comment.userid}</p>
            <p>postid: ${comment.postid}</p>
            <button class="edit-comment" data-comment-id="${comment.id}">Edit</button>
            <button class="delete-comment" data-comment-id="${comment.id}">Delete</button>
        </div>
        
        <div class="edit-form" id="edit-form-${comment.id}" style="display: none;">
            <textarea class="edit-textarea" id="edit-textarea-${comment.id}">${comment.body}</textarea>
            <button class="save-comment" data-comment-id="${comment.id}">Save</button>
            <button class="cancel-edit" data-comment-id="${comment.id}">Cancel</button>
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
