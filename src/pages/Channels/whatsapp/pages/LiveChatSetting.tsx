import { useState } from 'react';
import CampaignOptout from '../components/optin/CampaignOptout'
import MessageConfig from '../components/cards/MessageConfig';
import WorkingHours from '../components/workinghours/WorkingHours';

const LiveChatSetting = () => {
    const [autoResolve, setAutoResolve] = useState<boolean>(false);
    const [autoWelcomeMessage, setAutoWelcomeMessage] = useState<boolean>(false)
    return (
        <div className='max-w-7xl space-y-8  mx-auto py-10'>
            <CampaignOptout
                title="Auto Resolve Chats"
                description="Disable auto resolve intervened chats."
                enabled={autoResolve}
                onChange={setAutoResolve}
            />

            <div className='flex gap-10 bg-white p-10 rounded-2xl'>
                <MessageConfig
                    responseTitle={"Welcome Message"}
                    responseDescription={"Configure automated reply for user's first query during working hours"}
                    message={"Hi! Thanks for connecting. Someone from our team will get in touch soon."}
                    autoResponseEnabled={autoWelcomeMessage}
                    onToggle={setAutoWelcomeMessage}
                    onConfigure={() => console.log("Configure Welcome message")}
                />
                <div className='h-auto w-px bg-gray-200' />
                <MessageConfig
                    responseTitle={"Off Hours Message"}
                    responseDescription={"Configure automated reply for user's first query during off hours"}
                    message={"Hi! Thanks for connecting. Our team is unavailable right now. We’ll be back at 9am tomorrow."}
                    autoResponseEnabled={autoWelcomeMessage}
                    onToggle={setAutoWelcomeMessage}
                    onConfigure={() => console.log("Configure Welcome message")}
                />
            </div>

            <div>
                <WorkingHours />
            </div>

        </div>
    )
}

export default LiveChatSetting