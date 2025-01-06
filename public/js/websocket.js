import { handleSendMessage, handleIncomingMessage } from "../pages/messages.js";
import { displayUserStatus } from "../components/userList.js";
import { getCookieWithoutRequest, reRoute, SpecialFetch } from "./utils.js";

export const WebSocketSingleton = (function () {
  let instance; // Holds the single WebSocket instance
  let cookie = getCookieWithoutRequest("auth_token");
  if (cookie == null) {
    reRoute("/");
  }
  const url = `ws://localhost:8080/ws?token=${cookie}`; // Your fixed WebSocket URL

  return {
    getInstance: function () {
      if (!instance) {
        instance = new WebSocket(url);

        // Set up WebSocket event handlers
        instance.onopen = async () => {
          await handleSendMessage(socket);
          console.log("WebSocket connection established.");
        };
        instance.onmessage = async (event) => {
          try {
            let payload;
            try {
              payload = JSON.parse(event.data);
            } catch (error) {
              console.log("Received non-JSON message:", event.data, error);
              return;
            }
            if (Array.isArray(payload)) {
              const onlineUsers = payload.filter((user) => user.online);
              if (onlineUsers.length > 0) {
                console.log(
                  "Online users:",
                  onlineUsers.map((user) => user.username),
                );
              }

              // check if it is a user list
              await displayUserStatus(payload);
            } else {
              // otherwise, handle it as a chat message
              await handleIncomingMessage(event);
            }
          } catch (error) {
            console.error("Error handling WebSocket message:", error);
          }
        };
        instance.onclose = () => {
          console.log("WebSocket connection closed.");
          instance = null; // Reset instance on close
        };
        instance.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      }

      return instance;
    },
  };
})();
