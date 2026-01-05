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
