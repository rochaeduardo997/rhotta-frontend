export const getStringInitials = (value: string) => {
  return value
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};
