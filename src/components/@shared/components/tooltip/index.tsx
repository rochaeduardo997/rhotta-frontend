'use client';

import React from 'react';
import { cn } from '@src/lib/utils';
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  contentClassName?: string;
}

export function Tooltip({ children, content, contentClassName }: TooltipProps) {
  return (
    <TooltipProvider>
      <UiTooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={cn('max-w-xs bg-[#2D2D2D] text-white shadow', contentClassName)}>{content}</TooltipContent>
      </UiTooltip>
    </TooltipProvider>
  );
}

export default Tooltip;
