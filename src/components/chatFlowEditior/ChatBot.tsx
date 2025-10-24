"use client";
import { useEffect, useState } from "react";
import type { Edge } from "reactflow";

type FlowElement = {
  id: string;
  type: "text" | "option";
  content: string;
  title?: string;
  choices?: string[];
};
type ChatNode = { id: string; type: "chat"; data: { elements: FlowElement[] } };

type Message = { from: "bot" | "user"; text: string; options?: string[] };

const Chatbot = ({ nodes, edges }: { nodes: ChatNode[]; edges: Edge[] }) => {
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [currentNodeId, setCurrentNodeId] = useState(nodes[0]?.id);

  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    if (!currentNodeId) return;
    const currentNode = nodes.find((n) => n.id === currentNodeId);
    const texts =
      currentNode?.data.elements.filter((el) => el.type === "text") || [];

    const firstNodeMessages = texts.map((el) => ({
      from: "bot",
      text: el.content,
    }));

    console.log(firstNodeMessages);

    setMessages(() => [...firstNodeMessages]);
    // setMessages((prev) => [...prev, ...firstNodeMessages]);
  }, []);

  const getNextNode = (nodeId: string) => {
    console.log(edges);
    const edge = edges.find((e) => e.source === String(nodeId));

    console.log(edge);

    if (!edge) return null;

    return nodes.find((n) => n.id === edge.target);
  };

  const handleUserReply = (text: string) => {
    if (currentNode) {
      setMessages((prev) => [...prev, { from: "user", text }]);

      const nextNode = getNextNode(currentNodeId);
      if (nextNode) {
        const botReplyData = nextNode?.data?.elements.map((el) => {
          if (el.type === "option") {
            return {
              from: "bot",
              text: el.title,
              options: el.choices,
            };
          }
          return {
            from: "bot",
            text: el.content,
          };
        });

        console.log(botReplyData);

        setMessages((prev) => [...prev, ...botReplyData]);

        setCurrentNodeId(nextNode.id);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUserReply(userInput);
    setUserInput("");
  };

  const currentNode = nodes.find((n) => n.id === currentNodeId);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto border rounded-xl h-[80vh] bg-white shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div>
            <div
              key={i}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-5 py-2 max-w-[75%] text-sm ${
                  msg.from === "user"
                    ? "bg-blue-500 text-white rounded-2xl"
                    : "bg-gray-700 rounded-full  text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>

            {/* Options */}
            {msg?.options && msg?.options?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {msg?.options?.map((opt) => (
                  <button
                    key={opt}
                    className="bg-gray-50 hover:bg-gray-300 border border-slate-200 shadow-md text-gray-800 px-3 py-2 rounded-full text-sm transition cursor-pointer"
                    onClick={() => handleUserReply(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleFormSubmit} className="border-t p-3 flex gap-2">
        <input
          value={userInput}
          className="flex-1 border rounded-lg px-3 py-2 outline-none"
          placeholder="Type your message..."
          onChange={(e) => setUserInput(e.target.value)}
          // onKeyDown={(e) => {
          //   if (e.key === "Enter")
          //     handleUserReply((e.target as HTMLInputElement).value);
          // }}
          // onChange={(e) => {
          //   if (e.target.value === "") handleUserReply(e.target.value);
          // }}
        />
      </form>
    </div>
  );
};

export default Chatbot;
