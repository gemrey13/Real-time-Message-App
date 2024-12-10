import { Button } from "@/components/ui/button";

interface MessageInputProps {
  socket: WebSocket | null;
  onMessageSent: () => void;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  socket,
  onMessageSent,
  newMessage,
  setNewMessage,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(event.target.value);
  };



  return (
    <div className="message-input bg-white p-4 border-t border-slate-300 flex items-center">
      <textarea
        className="outline-none border-none flex-1 rounded-md resize-none p-3"
        value={newMessage}
        onChange={handleInputChange}
        placeholder="Type your message"
        name="message"
      />
      <Button className="px-3 py-5" onClick={onMessageSent}>
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
