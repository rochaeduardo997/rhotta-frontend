'use client';

import { Badge } from '@src/components/@shared/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@src/components/@shared/components/ui/popover';

export interface BadgeItem {
  id: string | number;
  label: string;
  values?: (string | number)[];
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

interface BadgeListProps {
  badges: BadgeItem[];
  limit?: number;
  className?: string;
}

export default function BadgeList({ badges, limit = 5, className = '' }: BadgeListProps) {
  if (!badges.length) return null;

  const visibleBadges = badges.slice(0, limit);
  const hiddenBadges = badges.slice(limit);
  const hasHiddenBadges = hiddenBadges.length > 0;

  const renderItem = (badge: BadgeItem) => (
    <Badge className="h-5 rounded-xl border-black px-1.5 font-normal" variant="outline" title={badge.label}>
      <span className="max-w-28 truncate whitespace-nowrap">{badge.label}</span>
    </Badge>
  );

  return (
    <div className={`space-y-1 ${className}`}>
      <ul className="space-y-1">
        {visibleBadges.map(badge => (
          <li key={badge.id}>{renderItem(badge)}</li>
        ))}
      </ul>

      {hasHiddenBadges && (
        <Popover>
          <PopoverTrigger asChild>
            <Badge className="h-5 cursor-pointer rounded-xl border-black px-1 font-mono" variant="outline">
              +{hiddenBadges.length}
            </Badge>
          </PopoverTrigger>
          <PopoverContent onOpenAutoFocus={e => e.preventDefault()}>
            <ul className="flex flex-wrap gap-1">
              {hiddenBadges.map(badge => (
                <li key={badge.id}>{renderItem(badge)}</li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
