interface MessageProps {
    text: string;
    status: "sent" | "received";
    messageOwner: string
}

const Message = ({ text, status, messageOwner }: MessageProps) => {
    return (
        <div
            className={`message mb-4 ${
                status === "sent" ? "flex justify-end" : "flex justify-start"
            }`}>
                {messageOwner}
            <div
                className={`message-bubble max-w-[70%] p-3 rounded-2xl ${
                    status === "sent"
                        ? "bg-sky-500 text-white rounded-br-none"
                        : "bg-slate-300 rounded-bl-none"
                }`}>
                {text}
            </div>
        </div>
    );
};

export default Message;
