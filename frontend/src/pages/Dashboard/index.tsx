import ChatArea from "@/components/chat/ChatArea";

export default function Dashboard() {
    return (
        <>
             <div className="flex flex-1 flex-col gap-4 p-4 h-screen">
                {/* {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="aspect-video h-12 w-full rounded-lg bg-muted/50" />
                ))} */}

                <ChatArea/>
            </div>
        </>
    );
}