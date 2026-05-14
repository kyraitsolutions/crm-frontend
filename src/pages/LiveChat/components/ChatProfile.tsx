import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstWordOfSentence } from "@/utils/typography.utils";
import { useMessageStore } from "../store/message.store";
import { extractSharedMedia } from "../utils/extract-shared-media.utils";
import { useConversationStore } from "../store/conversation.store";
import { buildAndGetVisitorDisplayNameByVisitorId } from "../utils/getVisitorDisplayName";
import { formatDate } from "@/utils/date.utils";
import { MdOutlinePeopleOutline } from "react-icons/md";

const ChatProfile = () => {
  const { messages } = useMessageStore((state) => state);
  const { conversations, selectedConversationId } = useConversationStore(
    (state) => state,
  );
  const sharedMedia = extractSharedMedia(messages);

  console.log("Shared Media", sharedMedia);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );

  if (!selectedConversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center border">
        <div className="size-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm">
          <MdOutlinePeopleOutline size={34} className="text-gray-400" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-700">
          No Conversation Selected
        </h2>

        <p className="mt-2 text-sm text-gray-500 max-w-xs">
          Select a conversation from the chat list to view customer profile and
          shared media.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-3 gap-3">
      <div>
        <h1 className="text-md text-gray-500 uppercase font-semibold">
          Customer Profile
        </h1>
        <div className="flex flex-col items-center  justify-center gap-2 py-4 bg-gray-100 rounded-2xl px-3 mt-2">
          <div>
            {selectedConversation?.profile?.avatar ? (
              <Avatar className="h-30 w-30 flex items-center justify-center bg-gray-100">
                <AvatarImage
                  className="object-cover bg-orange-600 text-white"
                  src={"https://ai-avatar-generator.com/avatars3/nature.png"}
                />
                <AvatarFallback className="bg-orange-600 text-white">
                  {getFirstWordOfSentence("Ahadgf") || "A"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="size-20 bg-gray-100 rounded-full border border-primary/20 flex justify-center items-center shadow">
                <MdOutlinePeopleOutline size={30} className="text-gray-400" />
              </div>
            )}
          </div>
          <h1 className="text-lg font-bold">
            {selectedConversation?.profile?.displayName ||
              buildAndGetVisitorDisplayNameByVisitorId(
                String(selectedConversation?.visitorId),
              )}
          </h1>
          {/* <p className="text-gray-500">Marketing Director @ Company Name</p> */}
          <div className="flex gap-5">
            <p className="text-sm text-gray-500">
              Joined: {formatDate(String(selectedConversation?.createdAt))}
            </p>
            <p className="text-sm px-2 bg-primary/20 rounded-xl text-center text-primary border border-primary">
              Active
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 py-4">
        {sharedMedia.slice(0, 5).map((media) => (
          <div
            key={media.messageId}
            className="w-16 h-16 rounded-xl overflow-hidden"
          >
            {media.type === "image" && (
              <img
                src={media.url}
                alt=""
                className="w-full h-full object-cover"
              />
            )}

            {media.type === "video" && (
              <video
                src={media.url}
                className="w-full h-full object-cover"
              // controls
              />
            )}

            {/* {media.type === "audio" && (
              <audio
                src={media.url}
                className="w-full h-full object-cover"
                // controls
              />
            )} */}
          </div>
        ))}

        {sharedMedia.length > 5 && (
          <div className="bg-gray-200 rounded-xl w-16 h-16 flex justify-center items-center text-lg text-gray-500">
            +{sharedMedia.length - 5}
          </div>
        )}
      </div>
      {/* <div>
        <h1 className="text-md text-gray-500 uppercase font-semibold">
          Shared media
        </h1>
        <div className="flex flex-wrap gap-2 py-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex justify-center items-center text-lg text-gray-500">
            12+
          </div>
        </div>
      </div> */}
      <div>
        <h1 className="text-md text-gray-500 uppercase font-semibold">
          Other Info
        </h1>
      </div>
    </div>
  );
};

export default ChatProfile;
