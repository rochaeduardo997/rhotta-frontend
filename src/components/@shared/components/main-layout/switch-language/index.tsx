'use client';

import { useLocale } from 'next-intl';
import { setCookie } from 'nookies';
import { Popover, PopoverContent, PopoverTrigger } from '@src/components/@shared/components/ui/popover';
import { cn } from '@src/lib/utils';

export default function SwitchLanguage() {
  const locale = useLocale();

  const changeLanguage = (newLocale: string) => {
    setCookie(undefined, 'locale', newLocale, { path: '/' });
    window.location.reload();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95">
          <img
            src={locale.startsWith('pt') ? '/flags/br.svg' : '/flags/us.svg'}
            alt="Language"
            className="h-5 w-5 rounded-full border border-black/10 object-cover shadow-sm"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" className="w-36 rounded-xl border border-black/10 bg-white p-1 shadow-lg">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => changeLanguage('pt-BR')}
            className={cn(
              'flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-black hover:bg-[#C9D4E4]',
              locale.startsWith('pt') && 'bg-brand-light! font-semibold text-brand'
            )}
          >
            <img src="/flags/br.svg" alt="Português" className="h-4 w-4 rounded-full border border-black/10 object-cover" />
            <span>Português</span>
          </button>
          <button
            onClick={() => changeLanguage('en-US')}
            className={cn(
              'flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-black hover:bg-[#C9D4E4]',
              locale.startsWith('en') && 'bg-brand-light! font-semibold text-brand'
            )}
          >
            <img src="/flags/us.svg" alt="English" className="h-4 w-4 rounded-full border border-black/10 object-cover" />
            <span>English</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
