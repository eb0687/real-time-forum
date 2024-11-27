import { attach, getCookie, getCookieWithoutRequest } from "../js/utils.js";
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

  socket.addEventListener("open", (event) => {
    console.log("Connected to the WebSocket server");
    handleSendMessage(socket);
  });

  socket.addEventListener("error", (event) => {
    console.error("WebSocket error observed:", event);
  });

  socket.onmessage = (event) => handleIncomingMessage(event);

  await attachBaseLayout(
    /*html*/ `
<div id="private-messages-container" class="flex flex-col pl-120px pr-120px gap-20px">
    <h2>Private Messages</h2>
    <div id="messages-container"></div>
    <div class="message-input-container">
        <input type="text" id="message-input" placeholder="Type your message here..." />
        <button id="send-message-button">Send</button>
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

    const senderUserName = await getUsernameByUserId(message.senderid);

    // Append the message with the username
    output.innerHTML += `
      <div>
        (${message.created_at.Time}) ${senderUserName}: ${message.body}
      </div>
    `;
  } catch (error) {
    console.error("Error parsing message:", error, "Data:", event.data);
  }
}

async function handleSendMessage(socket) {
  const sendButton = document.getElementById("send-message-button");
  const messageInput = document.getElementById("message-input");

  const senderId = await getCurrentUserId();

  sendButton.addEventListener("click", () => {
    const messageBody = messageInput.value.trim();
    if (messageBody) {
      const messageData = {
        body: messageBody,
        senderid: senderId,
        receiverid: 8, // TODO: make this dynamic
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
