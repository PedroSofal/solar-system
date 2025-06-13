import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export function Description({ children }: { children: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div
        className={`grid text-emerald-400 duration-500 ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <p className="overflow-hidden">{children}</p>
      </div>
      <div
        className={`grid text-emerald-400 duration-500 ${isExpanded ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr]'}`}
      >
        <p className="line-clamp-3 overflow-hidden">{children}</p>
      </div>
      <button
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-purple-400 focus:outline-none"
      >
        <span>{isExpanded ? 'Ver menos' : 'Ver mais'}</span>
        <span>
          {isExpanded ? (
            <ChevronUpIcon className="size-4 text-white" />
          ) : (
            <ChevronDownIcon className="size-4 text-white" />
          )}
        </span>
      </button>
    </div>
  );
}
