import { reRoute, SpecialFetch } from "../js/utils.js";

export const createPostModal = () => {
    const modal = document.createElement('div');
    modal.innerHTML = /*html*/`
        <div id="create-post-modal" class="modal">
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Create Post</h2>
                <form id="create-post-form">
                    <label for="post-title">Title:</label>
                    <input type="text" id="post-title" name="title" required>
                    <label for="post-body">Body:</label>
                    <textarea id="post-body" name="body" required></textarea>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalElement = document.getElementById('create-post-modal');
    const closeButton = modalElement.querySelector('.close-button');

    closeButton.addEventListener('click', () => {
        modalElement.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalElement) {
            modalElement.style.display = 'none';
        }
    });

    document.getElementById('create-post-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.getElementById('post-title');
        const body = document.getElementById('post-body');
        const res = await SpecialFetch("/api/posts", "POST", {
            title: title.value,
            body: body.value
        });
        if (!res) { return; }
        if (!res.ok) { return; }
        modalElement.style.display = 'none';
        title.value = ''; // Reset title field
        body.value = '';  // Reset body field
        await reRoute("/");
    });
};



