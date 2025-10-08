import React, { useState } from 'react';

interface ExpandableDescriptionProps {
  description: string;
  maxLines?: number;
  className?: string;
}

export const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({ 
  description, 
  maxLines = 2,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if description is long enough to need truncation
  const words = description.split(' ');
  const shouldTruncate = words.length > 20; // Approximate 2 lines worth of words
  
  if (!shouldTruncate) {
    return <p className={`text-sm text-muted-foreground ${className}`}>{description}</p>;
  }

  return (
    <div className={className}>
      <p className={`text-sm text-muted-foreground ${isExpanded ? '' : 'line-clamp-2'}`}>
        {description}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary hover:text-primary/80 font-medium mt-1 transition-colors"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};
