
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScrollableSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollableSidebar: React.FC<ScrollableSidebarProps> = ({ 
  children, 
  className = "" 
}) => {
  const handleWheel = React.useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const container = e.currentTarget as HTMLElement;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    // Allow scrolling within the container
    if ((e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight) ||
        (e.deltaY < 0 && scrollTop <= 0)) {
      // Only prevent default if we're at the boundaries
      e.preventDefault();
    }
  }, []);

  const handleScroll = React.useCallback((e: React.UIEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div 
      className={`h-full overflow-hidden ${className}`}
      onWheel={handleWheel}
      onScroll={handleScroll}
    >
      <ScrollArea className="h-full w-full">
        <div 
          className="p-2 space-y-2"
          style={{
            minHeight: '100%',
            overflowAnchor: 'none'
          }}
        >
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};
