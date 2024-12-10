import Message from "@/components/chat/Message";
import MessageInput from "@/components/chat/MessageInput";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChatArea: React.FC = () => {
  const { userID } = useParams<{ userID: string }>();
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);  // Track loading state

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("No token found, can't establish WebSocket connection");
      return;
    }

    const socketConnection = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${userID}/?token=${token}`);

    socketConnection.onopen = () => {
      console.log("WebSocket connection established");
      setLoading(false);  // Set loading to false once WebSocket is connected
    };

    socketConnection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data.message);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    socketConnection.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLoading(false);  // Stop loading if an error occurs
    };

    setSocket(socketConnection);

    return () => {
      socketConnection.close();
      console.log("WebSocket connection closed");
    };
  }, [userID, token]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.send(JSON.stringify({ message: newMessage }));

      // Add the new message to the state
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Clear the message input
      setNewMessage("");
    }
  };

  const handleMessageSent = () => {
    // You can perform any additional logic here after the message is sent
    console.log("Message sent and handled");
  };

  return (
    <div className="chat-area flex flex-col h-full">
      {/* Display loading state with Tailwind classes */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div> {/* Tailwind spinner */}
        </div>
      ) : (
        <>
          <div className="messages overflow-y-auto p-5 flex-1">
            {messages.map((message, index) => (
              <Message
                key={index}
                text={message}
                status={index % 2 === 0 ? "sent" : "received"}
              />
            ))}
          </div>

          <MessageInput
            socket={socket}
            onMessageSent={handleMessageSent}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
          />
        </>
      )}
    </div>
  );
};

export default ChatArea;
