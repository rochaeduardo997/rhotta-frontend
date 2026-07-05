import { Checkbox as CheckboxUI } from '@src/components/@shared/components/ui/checkbox';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@src/components/@shared/components/ui/form';

type TProps = {
  name: string;
  label?: string;
  disabled?: boolean;
};

export default function Checkbox({ disabled = false, label, name }: TProps) {
  const {
    control,
    formState: { isSubmitting }
  } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col gap-1.5 space-y-0">
          <FormItem className="flex items-center gap-1.5 space-y-0">
            <FormControl>
              <CheckboxUI
                id={name}
                disabled={disabled || isSubmitting}
                checked={field.value}
                {...field}
                onCheckedChange={value => field.onChange(value)}
              />
            </FormControl>
            <FormLabel htmlFor={name} className="text-primary-dark font-normal whitespace-nowrap">
              {label}
            </FormLabel>
          </FormItem>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
