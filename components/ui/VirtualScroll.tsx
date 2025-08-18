import React, { useState, useEffect, useMemo } from 'react';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleItemsCount + overscan * 2
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
    }));
  }, [items, startIndex, endIndex]);

  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{ height: itemHeight }}
              className="flex items-center"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hook for calculating optimal item height and container dimensions
export function useVirtualScrollDimensions(
  itemsCount: number,
  maxHeight: number = 600
) {
  const [dimensions, setDimensions] = useState({
    itemHeight: 200, // Default height for product cards
    containerHeight: Math.min(maxHeight, 600),
  });

  useEffect(() => {
    // Calculate optimal dimensions based on screen size
    const calculateDimensions = () => {
      const screenHeight = window.innerHeight;
      const availableHeight = screenHeight * 0.7; // Use 70% of screen height
      const optimalHeight = Math.min(availableHeight, maxHeight);
      
      setDimensions({
        itemHeight: 200, // Fixed height for product cards
        containerHeight: optimalHeight,
      });
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    
    return () => window.removeEventListener('resize', calculateDimensions);
  }, [maxHeight]);

  return dimensions;
}