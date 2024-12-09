import Message from "@/components/chat/Message"

const ChatArea = () => {
  return (
    <div className="chat-area flex flex-col">
        <div className="chat-header bg-slate-700 p-4 text-center"></div>
        <div className="messages overflow-y-auto p-5">
            <Message text="Hey, how's it going" status="sent"/>
            <Message text="I am good." status="received"/>
            <Message text="That's nice" status="sent"/>
        </div>
    </div>
  )
}

export default ChatArea