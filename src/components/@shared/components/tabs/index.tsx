'use client';

import { type ComponentProps } from 'react';
import { cn } from '@src/lib/utils';
import {
  Tabs as TabsPrimitive,
  TabsList as TabsListPrimitive,
  TabsTrigger as TabsTriggerPrimitive,
  TabsContent as TabsContentPrimitive
} from '@src/components/@shared/components/ui/tab';

function Tabs({ className, ...props }: ComponentProps<typeof TabsPrimitive>) {
  return <TabsPrimitive className={cn('flex flex-1 flex-col overflow-hidden', className)} {...props} />;
}

function TabsList({ className, ...props }: ComponentProps<typeof TabsListPrimitive>) {
  return (
    <TabsListPrimitive
      className={cn('flex h-auto w-full shrink-0 justify-start gap-1 rounded-none border-b border-border bg-[#f8fafc] dark:bg-background p-1', className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsTriggerPrimitive>) {
  return (
    <TabsTriggerPrimitive
      className={cn(
        'border-transparent py-3.5 text-sm',
        'data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:text-brand data-[state=active]:shadow-none',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: ComponentProps<typeof TabsContentPrimitive>) {
  return <TabsContentPrimitive className={cn('flex-1 overflow-y-auto p-6', className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
