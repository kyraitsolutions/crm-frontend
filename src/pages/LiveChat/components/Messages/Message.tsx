import type { TMessage } from "../../types/message.type";
import DocumentMessage from "./DocumentMessage";
import ImageMessage from "./ImageMessage";
import InteractiveMessage from "./InteractiveMessage";
import MessageWrapper from "./MessageWraper";
import QuestionMessage from "./QuestionMessage";
import TextMessage from "./TextMessage";
import VideoMessage from "./VideoMessage";

const Message = ({ message }: { message: TMessage }) => {
  const isIncoming = message.from === "user";
  const renderMessage = () => {
    switch (message.type) {
      case "text":
        return <TextMessage message={message} />;

      case "interactive":
        return <InteractiveMessage message={message} />;

      case "question":
        return <QuestionMessage message={message} />;

      case "image":
        return <ImageMessage message={message} />;

      case "video":
        return <VideoMessage message={message} />;

      case "document":
        return <DocumentMessage message={message} />;

      default:
        return null;
    }
  };

  return (
    <MessageWrapper
      isIncoming={isIncoming}
      status={message?.status}
      timestamp={String(message?.createdAt)}
    >
      {renderMessage()}
    </MessageWrapper>
  );
};

export default Message;

// import type { TMessage } from "../../types/message.type";
// import InteractiveMessage from "./InteractiveMessage";
// import QuestionMessage from "./QuestionMessage";
// import TextMessage from "./TextMessage";

// const Message = ({ message }: { message: TMessage }) => {
//   const isBot = message?.from === "bot";
//   switch (message.type) {
//     case "text":
//       return (
//         <TextMessage
//           // isBot={isBot}
//           message={message}
//           //   wrapperClass={wrapperClass}
//           //   commonClass={commonClass}
//           //   theme={{
//           //     backgroundColor,
//           //     color: userMessageColor,
//           //   }}
//         />
//       );

//     case "image":
//       return (
//         <div>Image</div>
//         // <div >
//         //   <div className="space-y-2">
//         //     <img
//         //       src={message?.media?.image?.link}
//         //       alt=""
//         //       className="max-w-xs rounded-2xl"
//         //     />

//         //     {message?.media?.image?.caption && (
//         //       <div className={`${commonClass} ${bubbleClass}`}>
//         //         {message.media?.image?.caption}
//         //       </div>
//         //     )}
//         //   </div>
//         // </div>
//       );

//     case "video":
//       return <div>Video</div>;

//     case "document":
//       return <div>Document</div>;

//     case "interactive":
//       return (
//         <InteractiveMessage
//           message={message}
//           isBot={isBot}
//           //   wrapperClass={wrapperClass}
//           //   commonClass={commonClass}
//           //   theme={{
//           //     backgroundColor,
//           //     color: userMessageColor,
//           //   }}
//           //   onButtonClick={onButtonClick}
//         />
//       );

//     case "question":
//       return (
//         <QuestionMessage
//           message={message}
//           //   wrapperClass={wrapperClass}
//           //   commonClass={commonClass}
//           isBot={isBot}
//           //   theme={{
//           //     backgroundColor,
//           //     color: userMessageColor,
//           //   }}
//         />
//       );

//     default:
//       return null;
//   }
// };

// export default Message;
