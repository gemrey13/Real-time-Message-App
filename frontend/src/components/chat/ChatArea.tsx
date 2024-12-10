import Message from "@/components/chat/Message";
import MessageInput from "@/components/chat/MessageInput";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


interface MessageType {
    sender_email: string;
    recipient_email: string;
    sender_name: string;
    recipient_name: string;
    message: string;
    timestamp: string;
    isCurrentUserMessage?: boolean;
}

const ChatArea: React.FC = () => {
    const { userID } = useParams<{ userID: string }>();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [newMessage, setNewMessage] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(true);
    const [currentUserEmail, setCurrentUserEmail] = useState<string>("");


    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            console.error("No token found, can't establish WebSocket connection");
            return;
        }

        const decodedToken: any = jwtDecode(token);
        const emailFromToken = decodedToken.email; 
        setCurrentUserEmail(emailFromToken);

        const socketConnection = new WebSocket(
            `ws://127.0.0.1:8000/ws/chat/${userID}/?token=${token}`
        );

        socketConnection.onopen = () => {
            console.log("WebSocket connection established");
            setLoading(false);
        };

        socketConnection.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message:", data);

            const isCurrentUserMessage = data.sender_email === emailFromToken;

            if (!isCurrentUserMessage) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        sender_email: data.sender_email,
                        recipient_email: data.recipient_email,
                        sender_name: data.sender_name,
                        recipient_name: data.recipient_name,
                        message: data.message,
                        timestamp: data.timestamp,
                        isCurrentUserMessage,
                    },
                ]);
            }

           
        };

        socketConnection.onerror = (error) => {
            console.error("WebSocket error:", error);
            setLoading(false);
        };

        setSocket(socketConnection);

        socketConnection.onclose = (event) => {
            console.log("WebSocket connection closed:", event);
            setLoading(false);
        };

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/messages/${userID}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const fetchedEmail = response.data.current_user_email;
                setCurrentUserEmail(fetchedEmail);

                const updatedMessages = response.data.messages.map((message: any) => {
                    const isCurrentUserMessage = message.sender_email === fetchedEmail;
                    return {
                        ...message,
                        isCurrentUserMessage,
                    };
                });
                setMessages(updatedMessages);
                console.log("Initial Data:", response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setLoading(false);
            }
        };

        fetchMessages();
    }, [userID, token]);

    const handleSendMessage = () => {
        if (newMessage.trim() && socket) {
            const messageData = {
                message: newMessage,
            };

            socket.send(JSON.stringify(messageData));
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender_email: currentUserEmail,
                    recipient_email: "",
                    sender_name: "You",
                    recipient_name: "",
                    message: newMessage,
                    timestamp: new Date().toISOString(),
                    isCurrentUserMessage: true, 
                },
            ]);
            // setNewMessage("");
        }
    };

    return (
        <div className="chat-area flex flex-col h-full">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="messages overflow-y-auto p-5 flex-1">
                    {messages.map((messageObj, index) => (
                            <Message
                                key={index}
                                text={messageObj.message}
                                status={messageObj.isCurrentUserMessage ? "sent" : "received"}
                            />
                        ))}
                    </div>

                    <MessageInput
                        socket={socket}
                        onMessageSent={handleSendMessage}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                    />
                </>
            )}
        </div>
    );
};

export default ChatArea;
