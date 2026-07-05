'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { cn } from '@src/lib/utils';
import { Button } from '@src/components/@shared/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@src/components/@shared/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@src/components/@shared/components/ui/popover';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@src/components/@shared/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { cva } from 'class-variance-authority';

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

export type Item = {
  value: string;
  label: string;
};

interface VirtualSelectProps {
  color?: 'primary';
  name?: string;
  placeholder?: string;
  items: Item[];
  disabled?: boolean;
  label?: string;
  loadMore?: () => Promise<void>;
  hasMore?: boolean;
  className?: string;
  emptyMessage?: string;
  hasSearchBar?: boolean;
  onChange?: (...args: any) => any;
}

export function VirtualSelect({
  color = 'primary',
  name = 'virtual select',
  label,
  placeholder = 'Selecione um item',
  className,
  items,
  disabled = false,
  loadMore,
  hasMore = false,
  hasSearchBar = false,
  emptyMessage = 'Sem resultados',
  onChange
}: VirtualSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const handleLoadMore = React.useCallback(async () => {
    if (!loadMore || !hasMore || loading) return;

    setLoading(true);
    try {
      await loadMore();
    } finally {
      setLoading(false);
    }
  }, [loadMore, hasMore, loading]);

  const filteredItems = React.useMemo(() => {
    if (!searchValue) return items;

    return items.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()));
  }, [items, searchValue]);

  const {
    control,
    formState: { isSubmitting }
  } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const selectedItem = (items || []).find(item => String(item.value) === String(field.value));

        return (
          <FormItem className={cn('flex w-full flex-col gap-2 space-y-0', className)}>
            {label && (
              <FormLabel htmlFor={name} className="text-primary-dark text-base font-normal">
                {label}
              </FormLabel>
            )}
            <FormControl>
              <Popover open={open} onOpenChange={setOpen} modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    id={name}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={variants({
                      color,
                      textColor: field.value ? 'primary' : 'placeholder'
                    })}
                    disabled={disabled || isSubmitting}
                  >
                    <span className="truncate pr-6">{selectedItem ? selectedItem.label : placeholder}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-96 p-0">
                  <Command shouldFilter={false}>
                    {hasSearchBar ?? <CommandInput placeholder="Buscar" value={searchValue} onValueChange={setSearchValue} />}
                    <CommandList id="scrollableDiv" onWheel={e => e.stopPropagation()}>
                      {filteredItems.length == 0 ? (
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          <InfiniteScroll
                            dataLength={filteredItems.length}
                            next={handleLoadMore}
                            hasMore={hasMore && !loading}
                            loader={
                              <div className="flex items-center justify-center p-2">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              </div>
                            }
                            scrollableTarget="scrollableDiv"
                            endMessage={
                              filteredItems.length > 0 ? (
                                <div className="p-2 text-center text-xs text-muted-foreground">Não há mais itens para serem carregados</div>
                              ) : null
                            }
                          >
                            {filteredItems.map(item => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={currentValue => {
                                  const matchedItem = (items || []).find(i => String(i.value).toLowerCase() === String(currentValue).toLowerCase());
                                  const newValue = matchedItem ? matchedItem.value : currentValue;
                                  field.onChange(newValue);
                                  setOpen(false);

                                  if (onChange) {
                                    onChange(newValue);
                                  }
                                }}
                              >
                                {item.label}
                                <Check className={cn('ml-auto', String(field.value) === String(item.value) ? 'opacity-100' : 'opacity-0')} />
                              </CommandItem>
                            ))}
                          </InfiniteScroll>
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
