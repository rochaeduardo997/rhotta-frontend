'use client';

import { cn } from '@src/lib/utils';
import { Tooltip } from '../tooltip';

interface TruncatedTextProps {
  text: string;
  maxLength: number;
  className?: string;
  tooltipClassName?: string;
}

export function TruncatedTextTooltip({ text, maxLength, className, tooltipClassName }: TruncatedTextProps) {
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? `${text.slice(0, maxLength).trimEnd()}…` : text;

  if (!shouldTruncate) return <span className={className}>{text}</span>;

  return (
    <Tooltip content={text} contentClassName={tooltipClassName}>
      <span className={cn('cursor-default', className)}>{displayText}</span>
    </Tooltip>
  );
}
