type Props = {
  date: string;
};

const DateSeparator = ({ date }: Props) => {
  return (
    <div className="flex justify-center my-2">
      <div className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full shadow">
        {date}
      </div>
    </div>
  );
};

export default DateSeparator;
