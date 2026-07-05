type TInput = {
  locale?: string;
  day?: Intl.DateTimeFormatOptions['day'];
  month?: Intl.DateTimeFormatOptions['month'];
  year?: Intl.DateTimeFormatOptions['year'];
  hour?: Intl.DateTimeFormatOptions['hour'];
  minute?: Intl.DateTimeFormatOptions['minute'];
  second?: Intl.DateTimeFormatOptions['second'];
};

export const formatDate = (date: Date | string, { locale = 'pt-BR', day = '2-digit', month = 'short', year, hour, minute, second }: TInput = {}) => {
  return new Date(date).toLocaleDateString(locale, { day, month, year, hour, minute, second });
};
