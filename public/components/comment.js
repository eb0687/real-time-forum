/**
 * @param {import("../js/types").Comment} comment
 * @returns {string}
 */
export const Comment = (comment) => {
  return /*html*/ `
    <div class="comment-content" id="comment-${comment.id}" data-userid="${comment.userid}")>
      <html></html>
  <style>
  

  </style>
      <div id="comment-container" class="flex flex-row pb-10px justify-start">
        <div id="comment-details-container" class="w-20%">
          <p>username: ${comment.username}</p>
          <p>id: ${comment.id}</p>
          <p>created: ${comment.created_at.Time}</p>
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
<style>
  #comment-container{
    border-bottom: 1px dotted white
  }
  #comment-details-container{
    min-width: 20%;
    border-right: 1px dotted white
  }
  #comment-body-container{
    min-height: 30%
    font-size: 1.2rem;
  }
  #comment-buttons-container button {
    font-size: 0.65rem;
    padding: 0 10px;
    min-width: 80px;
    cursor: pointer;
  }
  #comment-buttons-container button:hover {
    font-size: 0.65rem;
    padding: 0 10px;
    min-width: 80px;
    cursor: pointer;
    background-color: #ddd;
    color: black;
  }
  .edit-form{
    display: none;
    width: 100%;
    justify-content: space-between;
    padding: 10px 0 0 10px;
  }
  .edit-form textarea{
    width: 50%;
    height: 90%;
    resize: none;
  }
  #edit-form-buttons-container button{
    font-size: 0.65rem;
    padding: 0 10px;
    min-width: 80px;
    cursor: pointer;
  }
  #edit-form-buttons-container button:hover {
    font-size: 0.65rem;
    padding: 0 10px;
    min-width: 80px;
    cursor: pointer;
    background-color: #ddd;
    color: black;
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
