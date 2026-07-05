'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@src/lib/utils';
import Input, { TProps } from '@src/components/@shared/components/form/input';

export default function PasswordInput({ className, ...props }: Omit<TProps, 'type'>) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  function toggleVisibility() {
    setIsVisible(previous => !previous);
  }

  return (
    <div className="w-full">
      <div className="relative">
        <Input type={isVisible ? 'text' : 'password'} className={cn(className, 'pr-10')} {...props} />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute inset-y-0 right-3 flex items-center justify-center p-1 text-gray-500 transition-colors hover:cursor-pointer hover:text-gray-700 focus:outline-none"
          aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
    </div>
  );
}
