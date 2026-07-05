import { useFormContext, UseFormReturn } from 'react-hook-form';
import { cva, type VariantProps } from 'class-variance-authority';
import { Input as InputUI } from '@src/components/@shared/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@src/components/@shared/components/ui/form';
import type { InputHTMLAttributes } from 'react';

const variants = cva('w-full border-2 px-3 text-sm transition-colors', {
  variants: {
    color: {
      primary:
        'text-primary-dark dark:text-foreground border-input-border bg-white dark:bg-zinc-950 placeholder:text-input-placeholder hover:border-primary focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0'
    },
    size: {
      large: 'h-14 rounded-lg focus-visible:bg-accent',
      normal: 'h-9 rounded-sm'
    }
  }
});

type TVariantProps = VariantProps<typeof variants>;
export type TProps = {
  name: string;
  label?: string;
  secondLabel?: any;
  showError?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  TVariantProps;

export default function Input({
  className,
  color = 'primary',
  disabled,
  label,
  secondLabel,
  name,
  showError = true,
  size = 'normal',
  ...props
}: TProps) {
  const {
    control,
    formState: { isSubmitting }
  } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col gap-2 space-y-0">
          {label && (
            <FormLabel className="text-primary-dark flex justify-between text-base font-normal">
              <div>{label}</div>
              <div>{secondLabel}</div>
            </FormLabel>
          )}
          <FormControl>
            <InputUI disabled={disabled || isSubmitting} className={variants({ className, color, size })} {...field} {...props} />
          </FormControl>
          {showError && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
