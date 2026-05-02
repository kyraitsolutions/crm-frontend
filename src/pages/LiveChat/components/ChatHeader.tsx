import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getFirstWordOfSentence } from '@/utils/typography.utils'
import { Dot, EllipsisVertical, Phone } from 'lucide-react'

const ChatHeader = () => {

    return (
        <div className='bg-white px-3 py-2 border-l border-r border-gray-200'>
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 flex items-center justify-center bg-gray-100">
                    <AvatarImage className="object-cover bg-orange-600 text-white" src={"https://ai-avatar-generator.com/avatars3/nature.png"} />
                    <AvatarFallback className="bg-orange-600 text-white">
                        {getFirstWordOfSentence("Ahadgf") || "A"}
                    </AvatarFallback>
                </Avatar>
                <div className="">
                    <h1 className="text-lg font-semibold">Sarah Johnson</h1>
                    <p className="text-gray-500 text-sm flex items-center">
                        <span className="bg-green-500 rounded-full w-2 h-2 mr-2" />
                        <span>Online</span>
                        <Dot />
                        <span>WhatsApp</span>
                    </p>
                </div>

                <Phone size={18} className='text-gray-500 ml-auto' />
                <EllipsisVertical size={20} className='text-gray-500' />
            </div>

        </div>
    )
}

export default ChatHeader