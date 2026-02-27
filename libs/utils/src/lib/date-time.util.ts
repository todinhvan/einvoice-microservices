export const formatDateTime = (epochTime: number, locale: string) => {
  const date = new Date(epochTime);
  return date.toLocaleDateString(locale);
};
