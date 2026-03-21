export const getFirstWordOfSentence = (sentence: string) =>
  sentence
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");

export const getLastSlugFromPath = (path: string) => {
  return path.split("/").filter(Boolean).slice(3).join("/");
};
