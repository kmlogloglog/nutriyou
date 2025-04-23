import React, { useState, ReactNode, useRef, useEffect } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // Position the tooltip
  useEffect(() => {
    if (isVisible && tooltipRef.current && contentRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      
      // Position based on the specified direction
      switch (position) {
        case 'top':
          contentRef.current.style.bottom = `${tooltipRect.height}px`;
          contentRef.current.style.left = `${(tooltipRect.width - contentRect.width) / 2}px`;
          break;
        case 'bottom':
          contentRef.current.style.top = `${tooltipRect.height}px`;
          contentRef.current.style.left = `${(tooltipRect.width - contentRect.width) / 2}px`;
          break;
        case 'left':
          contentRef.current.style.right = `${tooltipRect.width}px`;
          contentRef.current.style.top = `${(tooltipRect.height - contentRect.height) / 2}px`;
          break;
        case 'right':
          contentRef.current.style.left = `${tooltipRect.width}px`;
          contentRef.current.style.top = `${(tooltipRect.height - contentRect.height) / 2}px`;
          break;
      }
    }
  }, [isVisible, position]);

  return (
    <div 
      className="inline-block relative cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={tooltipRef}
    >
      {children}
      
      {isVisible && (
        <div 
          ref={contentRef}
          className={`absolute z-50 px-3 py-2 bg-gray-800 text-white text-sm rounded shadow-md max-w-xs
            ${position === 'top' ? 'mb-2' : ''}
            ${position === 'bottom' ? 'mt-2' : ''}
            ${position === 'left' ? 'mr-2' : ''}
            ${position === 'right' ? 'ml-2' : ''}
          `}
        >
          {content}
          <div 
            className={`absolute w-2 h-2 bg-gray-800 transform rotate-45
              ${position === 'top' ? 'bottom-0 left-1/2 -mb-1 -translate-x-1/2' : ''}
              ${position === 'bottom' ? 'top-0 left-1/2 -mt-1 -translate-x-1/2' : ''}
              ${position === 'left' ? 'right-0 top-1/2 -mr-1 -translate-y-1/2' : ''}
              ${position === 'right' ? 'left-0 top-1/2 -ml-1 -translate-y-1/2' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;