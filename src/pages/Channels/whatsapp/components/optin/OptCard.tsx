import MessageConfig from "../cards/MessageConfig";

interface OptCardProps {
  title: string;
  description: string;

  responseTitle: string;
  responseDescription: string;

  keywords: string[];

  message: string;

  autoResponseEnabled: boolean;
  onToggle: (value: boolean) => void;

  onAddKeyword: () => void;
  onConfigure: () => void;
  onSave: () => void;
}

const OptCard = ({
  title,
  description,
  responseTitle,
  responseDescription,
  keywords,
  message,
  autoResponseEnabled,
  onToggle,
  onAddKeyword,
  onConfigure,
  onSave,
}: OptCardProps) => {
  return (
    <div className="rounded-xl bg-white p-10">
      <div className="grid grid-cols-2 gap-16">
        {/* Left */}
        <div>
          <h2 className="text-md">{title}</h2>

          <p className="mt-2 text-gray-500 text-sm max-w-sm">{description}</p>

          <div className="mt-8 space-y-3">
            {keywords.map((keyword, index) => (
              <input
                key={index}
                value={keyword}
                readOnly
                className="w-56 rounded-xl text-sm bg-gray-100 px-4 py-3 outline-none"
              />
            ))}
          </div>

          <button
            onClick={onAddKeyword}
            className="mt-6 flex items-center gap-1 text-sm font-medium text-teal-800"
          >
            <span className="text-xl">+</span>
            Add more
          </button>

          <button
            onClick={onSave}
            className="mt-10 rounded-xl bg-teal-900 px-4 py-2 text-xs font-medium text-white"
          >
            Save Settings
          </button>
        </div>

        <MessageConfig
          responseTitle={responseTitle}
          responseDescription={responseDescription}
          message={message}
          autoResponseEnabled={autoResponseEnabled}
          onToggle={onToggle}
          onConfigure={onConfigure}
        />
      </div>
    </div>
  );
};

export default OptCard;
