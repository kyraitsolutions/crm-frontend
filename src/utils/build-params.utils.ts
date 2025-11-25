// helper: remove empty, null, undefined, "All" values
const buildParams = (
  filters: Record<string, string | undefined | null>,
  skip: number,
  limit: number
) => {
  const cleaned: Record<string, string> = {
    skip: String(skip),
    limit: String(limit),
  };
  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !value.startsWith("All") &&
      value !== "Select dates"
    ) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export default buildParams;
