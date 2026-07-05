import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { type ButtonProps, Button as ButtonUI } from '@src/components/@shared/components/ui/button';

const variants = cva('flex h-8 items-center justify-center border-2 border-primary shadow-none transition-colors disabled:opacity-75', {
  variants: {
    color: {
      icon: 'hover:bg-gray-light border-none bg-transparent',
      input: 'h-9 rounded-sm border-input-border bg-white px-3 text-input-placeholder hover:border-primary hover:bg-white active:bg-white',
      primary: 'bg-primary text-white hover:border-primary-hover hover:bg-primary-hover',
      secondary: 'bg-white text-primary hover:bg-primary hover:text-white',
      tertiary: 'text-primary-dark bg-gray-light hover:bg-gray-dark border-none hover:text-white',
      white: 'text-primary-dark hover:bg-gray-light border-border bg-white',
      outline: 'hover:text-primary-dark border-2 border-input-border bg-transparent text-primary hover:bg-transparent',
      active: 'bg-gray-light hover:text-primary-dark hover:bg-gray-light border-2 border-input-border text-primary'
    },
    size: {
      icon: 'aspect-square h-8 w-8 p-0',
      large: 'h-9 px-4 font-normal',
      normal: 'gap-2 rounded-sm px-3 text-sm font-normal',
      small: 'gap-1 text-base font-medium',
      full: 'w-full'
    }
  }
});

type TVariantProps = VariantProps<typeof variants>;
type TButtonProps = TVariantProps & Omit<ButtonProps, 'size'>;

const Button = forwardRef<HTMLButtonElement, TButtonProps>(({ children, className, color, disabled, size = 'normal', ...props }, ref) => (
  <ButtonUI ref={ref} disabled={disabled} className={variants({ className, color, size })} {...props}>
    <div className="flex items-center gap-2 overflow-hidden">{children}</div>
  </ButtonUI>
));
Button.displayName = 'Button';

export default Button;
