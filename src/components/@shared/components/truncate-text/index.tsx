'use client';

import { useState } from 'react';
import { Button } from '../ui/button';

interface TruncateTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export function TruncateText({ text, maxLength = 150, className = '' }: TruncateTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isTruncated = text?.length > maxLength;
  const displayText = isExpanded ? text : /string/gi.test(typeof text) ? text.slice(0, maxLength) : text;

  return (
    <div className={className}>
      <p className="text-foreground">
        {/*<span dangerouslySetInnerHTML={{ __html: displayText }} />*/}
        {displayText}
        {isTruncated && !isExpanded && '...'}
        {isTruncated && (
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-1 inline h-auto p-0 text-primary hover:text-primary/80"
          >
            {isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
          </Button>
        )}
      </p>
    </div>
  );
}
