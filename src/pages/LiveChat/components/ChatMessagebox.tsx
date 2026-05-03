import { MdSend } from "react-icons/md"

const ChatMessagebox = () => {
    return (
        <div className="px-5 bg-white h-22 flex items-center relative border-l border-r">
            <input type="text"
                placeholder="Type your message here..."
                className="w-full bg-gray-100 text-sm rounded-xl py-5 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />

            <button className="absolute right-13 bottom-11 rounded-xl  transform translate-1/2 text-white bg-primary p-3">
                <MdSend size={20} />
            </button>
        </div>
    )
}

export default ChatMessagebox