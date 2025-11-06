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

type Message = {
  from: "bot" | "user";
  text: string;
  options?: string[];
  optionHandles?: string[];
};

const Chatbot = ({ nodes, edges }: { nodes: ChatNode[]; edges: Edge[] }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState(nodes[0]?.id);
  const [isSet, setIsSet] = useState(false);
  const [userInput, setUserInput] = useState("");

  const currentNode = nodes.find((n) => n.id === currentNodeId);

  // Initialize first node messages
  useEffect(() => {
    if (nodes) {
      setIsSet(!isSet);
      setCurrentNodeId(nodes[0]?.id);
    }
  }, [nodes]);

  useEffect(() => {
    if (!currentNodeId) return;

    const currentNode = nodes.find((n) => n.id === currentNodeId);
    const texts =
      currentNode?.data.elements.filter((el) => el.type === "text") || [];

    const firstNodeMessages = texts.map((el) => ({
      from: "bot",
      text: el.content,
    }));

    setMessages(firstNodeMessages);
  }, [isSet]);

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:3000");

    webSocket.onopen = function () {
      // console.log("WebSocket connection opened");
      // const payload = JSON.stringify({ event: "chat:messages" });
      // webSocket.send(payload);
    };

    webSocket.onmessage = function (event) {
      const wsResponse = JSON.parse(event.data);

      setMessages((prev) => [...prev, ...wsResponse?.data]);

      // setNodes(wsResponse?.data?.nodes);
      // setEdges(wsResponse?.data?.edges);
    };
  }, []);

  const handleUserReply = (text: string, sourceHandle?: string) => {
    const websocket = new WebSocket("ws://localhost:3000");
    if (!currentNode) return;

    websocket.onopen = function () {
      const payload = JSON.stringify({
        event: "chat:messages",
        data: {
          message: text,
          from: "user",
        },
      });
      websocket.send(payload);
    };
    // Add user message
    // setMessages((prev) => [...prev, { from: "user", text }]);
    // Find edge by sourceHandle if provided
    const outgoingEdges = edges?.filter((e) => e.source === currentNodeId);

    const matchedEdge = sourceHandle
      ? outgoingEdges.find((e) => e.sourceHandle === sourceHandle)
      : outgoingEdges[0]; // fallback to first edge if no handle

    const nextNodeId = matchedEdge?.target;
    if (!nextNodeId) return;

    const nextNode = nodes.find((n) => n.id === nextNodeId);
    if (!nextNode) return;

    // Prepare bot replies
    const botReplyData: Message[] = nextNode.data.elements.map((el) => {
      if (el.type === "option") {
        return {
          from: "bot",
          text: el.title,
          options: el.choices,
          optionHandles: el.choices?.map((_, i) => `${el.id}-choice-${i}`),
        };
      }
      return { from: "bot", text: el.content };
    });

    setMessages((prev) => [...prev, ...botReplyData]);
    setCurrentNodeId(nextNodeId);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userInput);
    if (!userInput) return;
    handleUserReply(userInput);
    setUserInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto border rounded-xl h-[80vh] bg-white shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i}>
            <div
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-5 py-2 max-w-[75%] text-sm ${
                  msg.from === "user"
                    ? "bg-blue-500 text-white rounded-2xl"
                    : "bg-gray-700 rounded-full text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>

            {/* Options */}
            {msg.options && msg.options.length > 0 && msg.optionHandles && (
              <div className="flex flex-wrap gap-2 mt-4">
                {msg.options.map((opt, idx) => (
                  <button
                    key={opt}
                    className="bg-gray-50 hover:bg-gray-300 border border-slate-200 shadow-md text-gray-800 px-3 py-2 rounded-full text-sm transition cursor-pointer"
                    onClick={() =>
                      handleUserReply(opt, msg.optionHandles?.[idx])
                    }
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
        />
      </form>
    </div>
  );
};

export default Chatbot;
