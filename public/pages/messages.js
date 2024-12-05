import { getCookieWithoutRequest, SpecialFetch } from "../js/utils.js";
import { getUsernameByUserId } from "./home.js";
import { attachBaseLayout } from "./layouts.js";
import { getCurrentUserId } from "./post.js";

export async function messagesPage() {
  const cookie = getCookieWithoutRequest("auth_token");
  console.log(document.cookie);
  if (cookie === null) {
    return;
  }

  const socket = new WebSocket(`ws://localhost:8080/ws?token=${cookie}`);

  socket.addEventListener("open", async (event) => {
    console.log("Connected to the WebSocket server");
    await handleSendMessage(socket);
  });

  socket.addEventListener("error", (event) => {
    console.error("WebSocket error observed:", event);
  });

  socket.onmessage = async (event) => {
    try {
      const payload = JSON.parse(event.data);

      // Check if its a user status list
      if (Array.isArray(payload)) {
        displayUserStatus(payload);
      } else {
        // Otherwise, handle it as a chat message
        await handleIncomingMessage(event);
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  };

  await attachBaseLayout(
    /*html*/ `
<div id="private-messages-container" class="flex flex-col pl-120px pr-120px gap-20px">
    <h2>Private Messages</h2>
    <div id="messages-container"></div>
    <div class="message-input-container">
        <input type="text" id="message-input" placeholder="Type your message here..." />
        <button id="send-message-button">Send</button>
    </div>
    <div id="user-list-container">
      <h3>Users</h3>
      <ul id="user-list"></ul>
    </div>
</div>
<style>
  .message-input-container input#message-input {
    width: 100%; 
    max-width: 800px; 
    padding: 10px 15px; 
    border: 2px solid ; 
    border-radius: 8px; 
    font-size: 16px; 
    color: #ddd; 
    outline: none; 
  }
  #messages-container {
    height: 600px; 
    overflow-y: auto;
    border: 2px solid; 
    border-radius: 8px; 
    padding: 10px; 
  }
  .message-input-container button#send-message-button {
    padding: 10px 20px; 
    background-color: #007BFF; 
    color: white; 
    font-size: 16px; 
    font-weight: bold; 
    border: none; 
    border-radius: 8px; 
    cursor: pointer; 
    transition: background-color 0.3s ease, transform 0.2s ease; 
  }
  .message-input-container button#send-message-button:hover {
      background-color: #0056b3; 
      transform: translateY(-2px); 
  }
  .message-input-container button#send-message-button:active {
    background-color: #004494; 
    transform: translateY(1px); 
  }
</style>
    `,
    capabilities,
  );
}

function capabilities() {}

async function handleIncomingMessage(event) {
  try {
    const message = JSON.parse(event.data);
    const output = document.getElementById("messages-container");

    if (
      message.senderid === selectedReceiverId ||
      message.receiverid === selectedReceiverId
    ) {
      const senderUserName = await getUsernameByUserId(message.senderid);

      output.innerHTML += `
        <div>
          (${message.created_at.Time}) ${senderUserName}: ${message.body}
        </div>
      `;
    }
  } catch (error) {
    console.error("Error parsing message:", error, "Data:", event.data);
  }
  // try {
  //   const message = JSON.parse(event.data);
  //   const output = document.getElementById("messages-container");
  //
  //   const senderUserName = await getUsernameByUserId(message.senderid);
  //
  //   output.innerHTML += `
  //     <div>
  //       (${message.created_at.Time}) ${senderUserName}: ${message.body}
  //     </div>
  //   `;
  // } catch (error) {
  //   console.error("Error parsing message:", error, "Data:", event.data);
  // }
}

async function handleSendMessage(socket) {
  const sendButton = document.getElementById("send-message-button");
  const messageInput = document.getElementById("message-input");

  const senderId = await getCurrentUserId();

  sendButton.addEventListener("click", () => {
    const messageBody = messageInput.value.trim();
    if (messageBody && selectedReceiverId) {
      const messageData = {
        body: messageBody,
        senderid: senderId,
        receiverid: selectedReceiverId,
      };

      socket.send(JSON.stringify(messageData));
      messageInput.value = "";
    }
  });

  messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendButton.click();
    }
  });
}

//  TODO: need to work on this
function displayUserStatus(userStatuses) {
  const userList = document.getElementById("user-list");
  userList.innerHTML = ""; // Clear the list before re-rendering

  userStatuses.forEach((user) => {
    const status = user.online ? "Online" : "Offline";
    const userElement = document.createElement("li");
    userElement.innerHTML = `
      <span>${user.username} (ID: ${user.id})</span>
      <span>${status}</span>
    `;

    userElement.addEventListener("click", () => handleUserSelect(user));

    userList.appendChild(userElement);
  });
}

let selectedReceiverId = null;
async function handleUserSelect(user) {
  selectedReceiverId = user.id;
  const messageInput = document.getElementById("message-input");
  messageInput.placeholder = `Type your message to ${user.username}...`;
  // console.log("Selected receiver ID:", selectedReceiverId);

  const messagesContainer = document.getElementById("messages-container");
  messagesContainer.innerHTML = "";

  await fetchMessageHistory(selectedReceiverId);
}

async function fetchMessageHistory(receiverId) {
  try {
    const currentUserId = await getCurrentUserId();
    const response = await SpecialFetch("/api/messages", "GET", {
      senderid: currentUserId,
      receiverid: receiverId,
      limit: 5,
      offset: 0,
    });

    if (!response.ok) {
      console.log("Failed to fetch message history:", response);
    }

    const messageHistory = await response.json();
    const messagesContainer = document.getElementById("messages-container");
    messagesContainer.innerHTML = "";

    messageHistory.reverse().forEach(async (message) => {
      const senderUserName = await getUsernameByUserId(message.senderid);

      messagesContainer.innerHTML += `
        <div class="${message.senderid === currentUserId ? "sent-message" : "received-message"}">
          (${message.created_at.Time}) ${senderUserName}: ${message.body}
        </div>
      `;
    });
  } catch (error) {
    console.error("Error fetching message history:", error);
  }
}
