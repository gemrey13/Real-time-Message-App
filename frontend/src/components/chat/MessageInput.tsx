import { Button } from "@/components/ui/button";
import { useState } from "react";

const MessageInput = () => {
    const [inputValue, setInputValue] = useState<string>("")

    const handleInputChange = (event: any) => {
        setInputValue(event.target.value)
    }

    const handleSendMessage = () => {
        console.log("send message")
    }
    return (
        <div className="messgae-input bg-white p-4 border-t border-slate-300 flex items-center">
            <textarea className="outline-none border-none flex-1 rounded-md resize-none p-3" value={inputValue} onChange={handleInputChange} placeholder="Type your message" name="message" />
            <Button className="px-3 py-5" onClick={handleSendMessage}>Send</Button>
        </div>
    );
};

export default MessageInput;
