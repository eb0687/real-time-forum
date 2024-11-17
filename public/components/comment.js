/**
 * @param {import("../js/types").Comment} comment
 * @returns {string}
 */
export const Comment = (comment) => {
  return /*html*/ `
    <div class="comment-content" id="comment-${comment.id}">
      <div id="comment-container" class="pb-10px flex flex-row justify-between">
        <div id="comment-details-container" class="pr-10px">
          <p>id: ${comment.id}</p>
          <p>created: ${comment.created_at.Time}</p>
          <p>userid: ${comment.userid}</p>
          <p>postid: ${comment.postid}</p>
        </div>
        <div id="comment-body-container" class="flex w-full pt-10px pl-10px">
          ${comment.body}
        </div>
        <div id="comment-buttons-container">
          <button class="edit-comment" data-comment-id="${comment.id}">Edit</button>
          <button class="delete-comment" data-comment-id="${comment.id}">Delete</button>
        </div>
        <div class="edit-form" id="edit-form-${comment.id}" style="display: none;">
          <textarea class="edit-textarea" id="edit-textarea-${comment.id}">${comment.body}</textarea>
          <button class="save-comment" data-comment-id="${comment.id}">Save</button>
          <button class="cancel-edit" data-comment-id="${comment.id}">Cancel</button>
        </div>
      </div>
    </div>
<style>
  #comment-container{
    border-bottom: 1px dotted white
  }
  #comment-details-container{
    border-right: 1px dotted white
  }
</style>


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
