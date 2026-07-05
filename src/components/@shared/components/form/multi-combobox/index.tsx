'use client';

import { cn } from '@src/lib/utils';
import { Button } from '@src/components/@shared/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@src/components/@shared/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@src/components/@shared/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@src/components/@shared/components/ui/popover';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const variants = cva('relative h-9 w-full justify-between rounded-sm border-2 px-3 font-normal', {
  variants: {
    color: {
      primary: 'border-input-border bg-white dark:bg-zinc-950 hover:border-primary hover:bg-white dark:hover:bg-zinc-950'
    },
    textColor: {
      placeholder: 'text-input-placeholder hover:text-input-placeholder',
      primary: 'text-primary-dark dark:text-foreground hover:text-primary-dark dark:hover:text-foreground'
    }
  }
});

type TItem = { label: string; value: string };

type TVariantProps = VariantProps<typeof variants>;

type TProps = {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  notFoundPlaceholder?: string;
  items: TItem[];
  className?: string;
} & TVariantProps;

export default function MultiCombobox({
  className,
  color = 'primary',
  disabled = false,
  items = [],
  label,
  name,
  notFoundPlaceholder = 'Nenhuma opção encontrada',
  placeholder,
  searchPlaceholder = 'Procurar opção...'
}: TProps) {
  const {
    control,
    formState: { isSubmitting }
  } = useFormContext();

  const [open, setOpen] = useState(false);

  const getItemsByValues = (values: string[]) => {
    return values.map(value => getItemByValue(value));
  };

  const commandFilter = (value: string, search: string) => {
    return getItemByValue(value)!.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
  };

  const getItemByValue = (value: string) => {
    return items.find(item => item.value === value);
  };

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn('flex w-full flex-col gap-2 space-y-0', className)}>
          {label && (
            <FormLabel htmlFor={name} className="text-primary-dark text-base font-normal">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={name}
                  role="combobox"
                  variant="outline"
                  aria-expanded={open}
                  disabled={disabled || isSubmitting}
                  className={variants({
                    color,
                    textColor: field?.value?.length > 0 ? 'primary' : 'placeholder'
                  })}
                >
                  <span className="truncate pr-6">
                    {field?.value?.length > 0
                      ? getItemsByValues(field.value)
                          .map(item => item?.label)
                          .join(', ')
                      : placeholder}
                  </span>
                  <ChevronsUpDown className="pointer-events-none absolute right-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full min-w-96 p-0">
                <Command filter={commandFilter}>
                  <CommandInput className="h-9" placeholder={searchPlaceholder} />
                  <CommandList>
                    <CommandEmpty>{notFoundPlaceholder}</CommandEmpty>
                    <CommandGroup>
                      {items.map(item => (
                        <CommandItem
                          key={item.value}
                          value={item.value}
                          onSelect={currentValue => {
                            field.onChange(
                              field?.value?.includes(currentValue)
                                ? field.value.filter((value: string) => value !== currentValue)
                                : [...field?.value, currentValue]
                            );
                          }}
                        >
                          {item.label}
                          <Check className={cn('ml-auto', field?.value?.includes(item.value) ? 'text-blue-500 opacity-100' : 'opacity-15')} />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
