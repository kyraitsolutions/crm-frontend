export const buildAndGetVisitorDisplayNameByVisitorId = (visitorId: string) => {
  if (!visitorId) return;
  return `Visitor ${visitorId.slice(-5).toUpperCase()}`;
};
