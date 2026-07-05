import { cn } from '@src/lib/utils';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@src/components/@shared/components/ui/form';
import { Textarea as TextareaUI } from '@src/components/@shared/components/ui/textarea';
import { cva } from 'class-variance-authority';
import { useFormContext } from 'react-hook-form';

const variants = cva(
  'text-primary-dark dark:text-foreground border-2 border-input-border bg-white dark:bg-zinc-950 px-3 text-sm transition-colors placeholder:text-input-placeholder hover:border-primary focus-visible:ring-0 focus-visible:ring-offset-0'
);

type TProps = {
  name: string;
  label?: string;
} & React.ComponentProps<typeof TextareaUI>;

export default function Textarea({ className, disabled, label, name, ...props }: TProps) {
  const {
    control,
    formState: { isSubmitting }
  } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn('flex w-full flex-col gap-2 space-y-0', className)}>
          {label && <FormLabel className="text-primary-dark text-base font-normal">{label}</FormLabel>}
          <FormControl>
            <TextareaUI className={variants()} {...props} {...field} disabled={disabled || isSubmitting} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
