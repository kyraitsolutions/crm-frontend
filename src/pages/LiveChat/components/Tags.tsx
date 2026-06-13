import Tags from "@/components/Tag/Tags"
import { useState } from "react"
const ChatTags = () => {

    const chatTags = [
        { label: "kshjg", color: "", },
        // { label: "sdf", color: "kjhbjvg", },
        // { label: "kdfshjg", color: "kjhbjvg", }
    ]
    const [tags, setTags] = useState<{ label: string; color: string }[]>(chatTags || []);
    const handleSave = () => {
        console.log("Saved")
    }
    return (
        <div>
            <Tags
                tags={tags}
                onChange={setTags}
                onSave={handleSave}
            />
        </div>
    )
}

export default ChatTags