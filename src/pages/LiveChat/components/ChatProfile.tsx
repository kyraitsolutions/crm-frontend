import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getFirstWordOfSentence } from "@/utils/typography.utils"

const ChatProfile = () => {
    return (
        <div className="flex flex-col px-3 gap-3">
            <div>
                <h1 className="text-md text-gray-500 uppercase font-semibold">Customer Profile</h1>
                <div className="flex flex-col items-center  justify-center gap-2 py-4 bg-gray-100 rounded-2xl px-3 mt-2">
                    <Avatar className="h-30 w-30 flex items-center justify-center bg-gray-100">
                        <AvatarImage className="object-cover bg-orange-600 text-white" src={"https://ai-avatar-generator.com/avatars3/nature.png"} />
                        <AvatarFallback className="bg-orange-600 text-white">
                            {getFirstWordOfSentence("Ahadgf") || "A"}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="text-lg font-bold">Sarah Johnson</h1>
                    <p className="text-gray-500">Marketing Director @ Company Name</p>
                    <div className="flex gap-5">
                        <p className="text-sm text-gray-500">Joined: January 2022</p>
                        <p className="text-sm px-2 bg-primary/20 rounded-xl text-center text-primary border border-primary">Active</p>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="text-md text-gray-500 uppercase font-semibold">Shared media</h1>
                <div className="flex flex-wrap gap-2 py-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex justify-center items-center text-lg text-gray-500">12+</div>
                </div>
            </div>
            <div>
                <h1 className="text-md text-gray-500 uppercase font-semibold">Other Info</h1>

            </div>
        </div>
    )
}

export default ChatProfile