import Message from "@/components/chat/Message"
import MessageInput from "@/components/chat/MessageInput"

const ChatArea = () => {
  return (
    <div className="chat-area flex flex-col h-full">
        <div className="messages overflow-y-auto p-5 flex-1">
            <Message text="Hey, how's it going" status="sent"/>
            <Message text="I am good." status="received"/>
            <Message text="That's nice" status="sent"/>
        </div>

        <MessageInput />
    </div>
  )
}

export default ChatArea