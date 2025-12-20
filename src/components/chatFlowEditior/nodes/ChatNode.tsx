import { Handle, Position } from "reactflow";
import { v4 as uuid } from "uuid";
import { MdOutlineDelete } from "react-icons/md";
import ConfirmModal from "@/components/confirm";
import { Fragment, useState } from "react";

export type BaseElement = {
  id: string;
  type: "text" | "option" | "date";
};

export type ChatElement = {
  id: string;
  type: "text" | "option" | "date";
  content: string;
  title?: string;
  choices?: string[];
};

type ChatNodeData = {
  id: string;
  data: {
    label: string;
    value?: "text" | "option";
    name?: "date";
    elements: ChatElement[];
    updateNode: (id: string, elements: ChatElement[]) => void;
    deleteNode: (id: string) => void;
  };
};

export const ChatNode = ({ id, data }: ChatNodeData) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const addElement = (type: "text" | "option" | "date") => {
    const newElementObj = {
      id: uuid(),
      type,
      content: "",
      ...(type === "option" && { choices: [""] }),
      date: "",
    };
    const newElement = { ...newElementObj };
    data.updateNode(id, [...data.elements, newElement]);
  };

  const updateElement = (elementId: string, key: string, value: any) => {
    const newElements = data.elements.map((el) =>
      el.id === elementId ? { ...el, [key]: value } : el
    );
    data.updateNode(id, newElements);
  };
  const updateOptionChoice = (
    elementId: string,
    index: number,
    value: string
  ) => {
    const newElements = data.elements.map((el) => {
      if (el.id === elementId && el.type === "option") {
        const updatedChoices = [...(el.choices as string[])];
        updatedChoices[index] = value;
        return { ...el, choices: updatedChoices };
      }
      return el;
    });
    data.updateNode(id, newElements);
  };

  const addOptionChoice = (elementId: string) => {
    console.log(elementId);
    console.log(data);
    const newElements = data.elements.map((el) => {
      if (el.id === elementId && el.type === "option") {
        return { ...el, choices: [...(el.choices as string[]), ""] };
      }
      return el;
    });
    data.updateNode(id, newElements);
  };

  const removeOptionChoice = (elementId: string, index: number) => {
    const newElements = data.elements.map((el) => {
      if (el.id === elementId && el.type === "option" && el.choices) {
        const updatedChoices = el.choices.filter((_, i) => i !== index);
        return { ...el, choices: updatedChoices };
      }
      return el;
    });
    data.updateNode(id, newElements);
  };

  async function handleConfirm() {
    data.deleteNode(id);
  }

  return (
    <Fragment>
      <div>
        <p className="text-xs mb-2 bg-gray-200/40 text-green-600  w-fit rounded-2xl px-4 py-1">
          {data?.label}
        </p>
        <div className="bg-white border rounded shadow w-64 relative">
          <Handle
            type="target"
            position={Position.Top}
            style={{
              width: 14, // default is 8
              height: 14,
              background: "#56c340", // Tailwind's sky-500 for example
              border: "2px solid #c9f3d2",
            }}
          />

          <div className="bg-gray-600 flex justify-end py-1.5 px-2 rounded-t-xl">
            <button
              // onClick={() => data.deleteNode(id)}
              onClick={() => setOpenConfirmModal(true)}
              className="text-xs rounded-lg  text-white cursor-pointer"
            >
              <MdOutlineDelete color="#fbfbfb" size={16} />
            </button>
          </div>

          <div className="px-1 py-2">
            {data?.elements?.map((el) => (
              <div key={el.id} className="mb-2">
                {el.type === "text" ? (
                  <textarea
                    className="w-full border-2 rounded px-3 py-2 text-xs"
                    value={el.content}
                    onChange={(e) =>
                      updateElement(el.id, "content", e.target.value)
                    }
                    placeholder="Enter text..."
                  />
                ) : (
                  <input
                    type={el.type}
                    className="w-full border-2 rounded px-3 pt-2 pb-4 text-xs"
                    onChange={(e) =>
                      updateElement(el.id, "content", e.target.value)
                    }
                    value={el.content}
                  />
                )}

                {/* {el.type === "option" && (
              <div className="border rounded p-2 bg-gray-50">
                <input
                  className="w-full border-b pb-1 mb-2 text-xs font-medium outline-none"
                  placeholder="Option title..."
                  value={el.title}
                  onChange={(e) => updateElement(el.id, "title", e.target.value)}
                />

                {el?.choices?.map((choice, i) => (
                  <div key={i} className="flex items-center gap-1 mb-1">
                    <input
                      className="flex-1 border rounded px-2 py-1 text-xs"
                      value={choice}
                      onChange={(e) =>
                        updateOptionChoice(el.id, i, e.target.value)
                      }
                      placeholder={`Option ${i + 1}`}
                    />
                    <button
                      onClick={() => removeOptionChoice(el.id, i)}
                      className="bg-red-400 text-white text-xs px-1 rounded"
                    >
                      -
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addOptionChoice(el.id)}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded mt-1"
                >
                  + Add Choice
                </button>
              </div>
            )} */}

                {el.type === "option" && (
                  <div className="border rounded p-2 bg-gray-50">
                    {/* Title */}
                    <input
                      className="w-full border-b pb-1 mb-2 text-xs font-medium outline-none"
                      placeholder="Option title..."
                      value={el.title}
                      onChange={(e) =>
                        updateElement(el.id, "title", e.target.value)
                      }
                    />

                    {/* Choices */}
                    {el?.choices?.map((choice, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 mb-1 relative"
                      >
                        <input
                          className="flex-1 border rounded px-2 py-1 text-xs"
                          value={choice}
                          onChange={(e) =>
                            updateOptionChoice(el.id, i, e.target.value)
                          }
                          placeholder={`Option ${i + 1}`}
                        />
                        <button
                          onClick={() => removeOptionChoice(el.id, i)}
                          className="bg-red-400 text-white text-xs px-1 rounded"
                        >
                          -
                        </button>

                        {/* 🎯 Add a handle for each choice */}
                        <div className="ml-2">
                          <Handle
                            type="source"
                            id={`${el.id}-choice-${i}`}
                            position={Position.Right}
                            // style={{
                            //   right: -9,
                            //   top: "50%",
                            //   transform: "translateY(-50%)",
                            //   background: "#2563eb",
                            //   width: 8,
                            //   height: 8,
                            //   borderRadius: "50%",
                            //   cursor: "pointer",
                            // }}
                          />
                        </div>
                      </div>
                    ))}

                    {/* {el?.choices?.map((choice, i) => (
                <div key={i} className="flex items-center gap-1 mb-1">
                  <input
                    className="flex-1 border rounded px-2 py-1 text-xs"
                    value={choice}
                    onChange={(e) =>
                      updateOptionChoice(el.id, i, e.target.value)
                    }
                    placeholder={`Option ${i + 1}`}
                  />

                  <button
                    onClick={() => removeOptionChoice(el.id, i)}
                    className="bg-red-400 text-white text-xs px-1 rounded"
                  >
                    -
                  </button>
                </div>
              ))} */}

                    {/* Add new choice */}
                    <button
                      onClick={() => addOptionChoice(el.id)}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded mt-1"
                    >
                      + Add Choice
                    </button>
                  </div>
                )}
                {el.type === "date" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Date"
                      className="w-full border rounded px-3 py-2 text-xs"
                      value={el.content}
                      onChange={(e) =>
                        updateElement(el.id, "content", e.target.value)
                      }
                    />
                    <input
                      type="date"
                      className="w-full border rounded px-3 py-2 text-xs"
                      value={el.content}
                      onChange={(e) =>
                        updateElement(el.id, "content", e.target.value)
                      }
                      placeholder="Enter date..."
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-1 mt-1">
              {data.value === "text" && (
                <button
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded flex-1"
                  onClick={() => addElement("text")}
                >
                  + Text
                </button>
              )}

              {data.value === "option" && (
                <button
                  className="text-xs bg-green-500 text-white px-2 py-1 rounded flex-1"
                  onClick={() => addElement("option")}
                >
                  + Option
                </button>
              )}

              {data.name === "date" && (
                <button
                  className="text-xs bg-green-500 text-white px-2 py-1 rounded flex-1"
                  onClick={() => addElement("date")}
                >
                  + Date
                </button>
              )}
            </div>
          </div>

          <Handle
            type="source"
            position={Position.Bottom}
            style={{
              width: 14, // default is 8
              height: 14,
              background: "#56c340", // Tailwind's sky-500 for example
              border: "2px solid #c9f3d2",
            }}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={openConfirmModal}
        title="Delete item"
        description="Are you sure you want to permanently delete this item?"
        confirmText="Yes, delete"
        cancelText="No, keep it"
        // loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setOpenConfirmModal(false)}
      />
    </Fragment>
  );
};
