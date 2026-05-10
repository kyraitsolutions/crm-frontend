export const formatChatDate = (date: string | Date) => {
  const msgDate = new Date(date);
  const today = new Date();

  const isToday =
    msgDate.getDate() === today.getDate() &&
    msgDate.getMonth() === today.getMonth() &&
    msgDate.getFullYear() === today.getFullYear();

  if (isToday) return "Today";

  return msgDate.toLocaleDateString("en-GB");
};

export const isSameDay = (d1: string | Date, d2: string | Date) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);

  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};
