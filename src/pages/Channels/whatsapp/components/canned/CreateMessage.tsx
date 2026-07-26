import { HEADER_MEDIA_TYPES } from "@/components/chatFlowEditior/config"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRef, useState } from "react"
import { HeaderMediaUploader } from "../template-builder/content/header/HeaderMediaUploader"
import { Textarea } from "@/components/ui/textarea"
import { formatWhatsappMessage } from "@/utils/textFormat"
import { Button } from "@/components/ui/button"
import { handleHistoryBack } from "@/utils/back.utils"
import { ArrowLeft } from "lucide-react"

const CreateMessage = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [templateName, setTemplateName] = useState<string>("abhi");
    const [messageType, setMessageType] = useState<"text" | "image" | "video" | "document">("text")
    const [messageText, setMessageText] = useState<string>("")
    const [media, setMedia] = useState<string>("");

    return (

        <div className="max-w-7xl mx-auto py-10 h-[calc(100vh-64px)] overflow-y-scroll hide-scrollbar">
            <div className="flex items-center gap-4 mb-5">
                <Button
                    onClick={handleHistoryBack}
                    className="actions-btn rounded-full!"
                >
                    <ArrowLeft />
                </Button>
                <p>New Canned Message</p>
            </div>

            <div className="flex-1 p-10 bg-white rounded-2xl">
                <div className="max-w-3xl flex flex-col gap-6">

                    <div className="space-y-2">

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                            Pick a name which describes your message.
                        </p>
                        <div className="relative">
                            <Input
                                className="input-field pr-14 rounded-xl! bg-gray-200/30 border-none"
                                type="text"
                                value={templateName}
                                //   onChange={handleNameChange}
                                maxLength={60}
                                placeholder="e.g. order_confirmation"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                                {templateName.length}/64
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Use lowercase letters and underscores only.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message Type
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                            Select one of the message types to proceed
                        </p>
                        <Select
                            value={messageType}
                            onValueChange={(value) =>
                                setMessageType(value as "text" | "image" | "video" | "document")
                            }

                        >
                            <SelectTrigger className="input-field rounded-xl! w-full capitalize  bg-gray-200/30 border-none">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent className="rounded-xl!">
                                {HEADER_MEDIA_TYPES.map((type) => (
                                    <SelectItem key={type} value={type} className="capitalize">
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 ">
                        {messageType === "text" ? (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                    {messageType}
                                </label>
                                <p className="text-xs text-gray-400 mt-1">
                                    Use text formatting -*bold* & _italic_ <br />
                                    Text can be upto 4096 characters long<br />
                                    Personalize messages with $FirstName,$Name,$MobileNumber,$LastName$ custom attributes.<br />
                                    {"Customize messages with dynamic parameters e.g - Your Verification code is {{1}}"}
                                </p>



                                <div className="relative">
                                    <Textarea
                                        ref={textareaRef}
                                        value={messageText}
                                        onChange={(e) => {
                                            setMessageText(e.target.value);
                                            // saveCursor();
                                        }}
                                        // onMouseUp={saveCursor}
                                        maxLength={1024}
                                        rows={5}
                                        placeholder="Enter your message body"
                                        className="input-field  rounded-xl!  bg-gray-200/30 border-none resize-none pb-6 text-sm min-h-24"
                                    />
                                    <span className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">
                                        {messageText.length}/1024
                                    </span>
                                </div>
                            </div>

                        ) : (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                    {messageType}
                                </label>
                                <p className="h-50 border flex justify-center items-center text-sm">Here put a media upload re use template head or create another one</p>
                                {/* <HeaderMediaUploader /> */}
                            </>

                        )}
                    </div>


                    <div>
                        <p className="block text-sm font-medium! text-gray-700 mb-1 capitalize">Message Preview</p>
                        <div>
                            {messageType !== "text" && <img src="" alt="media" className="w-full rounded-2xl border border-dashed h-50 object-cover" />}
                            <div
                                className="bg-[#DCF8C6] whitespace-pre-wrap rounded-xl p-4 text-sm leading-5 text-gray-900"
                                dangerouslySetInnerHTML={{
                                    __html: formatWhatsappMessage(messageText),
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button className="rounded-xl py-1.5! text-sm bg-teal-900 hover:bg-teal-900/80">
                            Submit
                        </Button>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CreateMessage