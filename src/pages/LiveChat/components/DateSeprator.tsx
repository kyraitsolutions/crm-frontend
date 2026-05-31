type Props = {
  date: string;
};

const DateSeparator = ({ date }: Props) => {
  return (
    <div className="flex justify-center my-2">
      <div className="bg-primary text-white text-xs px-3 py-1 rounded-full">
        {date}
      </div>
    </div>
  );
};

export default DateSeparator;
