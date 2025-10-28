import { Handle, Position } from "reactflow";
import { v4 as uuid } from "uuid";

export const ChatNode = ({ id, data }: any) => {
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
        const updatedChoices = [...el.choices];
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
        return { ...el, choices: [...el.choices, ""] };
      }
      return el;
    });
    data.updateNode(id, newElements);
  };

  const removeOptionChoice = (elementId: string, index: number) => {
    const newElements = data.elements.map((el) => {
      if (el.id === elementId && el.type === "option") {
        const updatedChoices = el.choices.filter((_, i) => i !== index);
        return { ...el, choices: updatedChoices };
      }
      return el;
    });
    data.updateNode(id, newElements);
  };

  console.log(data)
  return (
    <div>
      <p className="text-xs">{data?.label}</p>

      <div className="bg-white border p-2 rounded shadow w-64 relative">

        <Handle type="target" position={Position.Top} />

        {/* <div className="flex justify-end pb-2">
          <button
            onClick={() => data.deleteNode(id)}
            className="text-xs bg-red-500 text-white px-1 rounded cursor-pointer"
          >
            ✕
          </button>
          {el.type === "option" && (
            <div className="border rounded p-2 bg-gray-50">
              <input
                className="w-full border-b pb-1 mb-2 text-xs font-medium outline-none"
                placeholder="Option title..."
                value={el.title}
                onChange={(e) => updateElement(el.id, "title", e.target.value)}
              />

              {el?.choices?.map((choice, i) => (
                <div key={i} className="flex items-center gap-1 mb-1 relative">
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
        </div> */}

        {data.elements.map((el: any) => (
          <div key={el.id} className="mb-2">
            {el.type === "text" && (
              <textarea
                className="w-full border rounded px-3 py-2 text-xs"
                value={el.content}
                onChange={(e) => updateElement(el.id, "content", e.target.value)}
                placeholder="Enter text..."
              />
            )}

            {el.type === "option" && (
              <div className="border rounded p-2 bg-gray-50">
                {/* Title */}
                <input
                  className="w-full border-b pb-1 mb-2 text-xs font-medium outline-none"
                  placeholder="Option title..."
                  value={el.title}
                  onChange={(e) => updateElement(el.id, "title", e.target.value)}
                />

                {/* Choices */}
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
          {data.value === "text" && <button
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded flex-1"
            onClick={() => addElement("text")}
          >
            + Text
          </button>}

          {data.value === "option" && <button
            className="text-xs bg-green-500 text-white px-2 py-1 rounded flex-1"
            onClick={() => addElement("option")}
          >
            + Option
          </button>}

          {data.name === "date" && <button
            className="text-xs bg-green-500 text-white px-2 py-1 rounded flex-1"
            onClick={() => addElement("date")}
          >
            + Date
          </button>}
        </div>

        <Handle type="source" position={Position.Bottom} />
      </div>
    </div>

  );
};