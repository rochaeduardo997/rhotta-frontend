import type { HTMLAttributes } from 'react';
import { cn } from '@src/lib/utils';
import { Skeleton } from '@src/components/@shared/components/ui/skeleton';

const DEFAULT_QUANTITY_OF_BUTTONS = 3;

type TProps = { quantityOfButtons?: number } & HTMLAttributes<HTMLElement>;

export default function PaginationSkeleton({ className, quantityOfButtons = DEFAULT_QUANTITY_OF_BUTTONS, ...props }: TProps) {
  return (
    <div className={cn('flex gap-1', className)} {...props}>
      {[...Array(quantityOfButtons).keys()].map(index => (
        <Skeleton key={index} className="aspect-square h-8 w-8" />
      ))}
    </div>
  );
}
