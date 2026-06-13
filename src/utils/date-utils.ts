export const formatTime = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Format as: 25 Nov 2026
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("en-GB", options).replace(/,/g, "");
};

export const formatToDayMonth = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });

  return `${day} ${month}`;
};


export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return ` ${formattedTime.toUpperCase()}, ${formattedDate.replace(/,/g, "")}`;
};


interface DateRangeParams {
    days?: number;
    startDate?: string;
    endDate?: string;
}

const toLocalISODate = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
export  const getDateRange = ({ days, startDate, endDate }: DateRangeParams) => {
        // Custom date range
        if (startDate && endDate) {
            return {
                startDate,
                endDate,
            };
        }
        // Days-based range
        if (days) {
            const today = new Date();

            const start = new Date();
            start.setDate(today.getDate() - (days - 1));

            return {
                startDate: toLocalISODate(start),
                endDate: toLocalISODate(today),
            };
        }

        return {
            startDate: "",
            endDate: "",
        };
    };