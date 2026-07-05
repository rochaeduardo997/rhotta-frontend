import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const store = await cookies();
  const localeInCookie = store.get('locale')?.value;
  let locale = localeInCookie || 'en-US';
  if (locale.startsWith('pt')) {
    locale = 'pt-BR';
  } else {
    locale = 'en-US';
  }
  
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages };
});
