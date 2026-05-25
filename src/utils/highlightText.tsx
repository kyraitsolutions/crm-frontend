export const highlightText = (text: string, search: string) => {
  if (!text) return null;

  if (!search) {
    return <p className="text-sm text-gray-500">{text}</p>;
  }

  const regex = new RegExp(`(${search})`, "gi");

  return (
    <p className="text-sm text-gray-500 leading-5">
      {text.split(regex).map((part, index) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <span
            key={index}
            className="bg-yellow-200 text-black rounded px-0.5 font-medium"
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </p>
  );
};
