export const ChatMessagesSkeleton = () => {
  return (
    <div className="h-[70vh] flex flex-col gap-6 p-4 overflow-y-hidden">
      {Array.from({ length: 5 }).map((_) => (
        <div>
          {/* LEFT MESSAGE */}
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300" />

            <div className="max-w-[75%]">
              {/* Message Bubble */}
              <div className="rounded-2xl rounded-tl-sm border bg-white px-4 py-3 shadow-sm">
                <div className="h-4 w-52 animate-pulse rounded bg-gray-200" />
                <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-200" />
                <div className="mt-3 h-4 w-44 animate-pulse rounded bg-gray-200" />
              </div>

              {/* Time */}
              <div className="mt-2 h-3 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          {/* RIGHT MESSAGE */}
          <div className="flex justify-end gap-3">
            <div className="max-w-[75%]">
              {/* Message Bubble */}
              <div className="rounded-2xl rounded-tr-sm bg-white px-4 py-3">
                <div className="h-4 w-44 animate-pulse rounded bg-gray-200" />
                <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-200" />
              </div>

              {/* Time */}
              <div className="mt-2 ml-auto h-3 w-16 animate-pulse rounded bg-gray-200" />
            </div>

            {/* Avatar */}
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300" />
          </div>
        </div>
      ))}
    </div>
  );
};
