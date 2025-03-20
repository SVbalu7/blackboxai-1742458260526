import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const Virtualized = ({
  items,
  renderItem,
  itemHeight,
  height = 400,
  overscan = 3,
  onEndReached,
  endReachedThreshold = 200,
  className = '',
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // Calculate visible range
  const visibleCount = Math.ceil(height / itemHeight);
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.floor((scrollTop + height) / itemHeight) + overscan
  );

  // Handle scroll
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setScrollTop(scrollTop);

    // Check if end is reached
    if (
      onEndReached &&
      scrollHeight - scrollTop - clientHeight < endReachedThreshold
    ) {
      onEndReached();
    }
  }, [onEndReached, endReachedThreshold]);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      style={{ height, overflow: 'auto' }}
      className={className}
      {...props}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {items.slice(startIndex, endIndex).map((item, index) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              left: 0,
              right: 0
            }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

Virtualized.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  ).isRequired,
  renderItem: PropTypes.func.isRequired,
  itemHeight: PropTypes.number.isRequired,
  height: PropTypes.number,
  overscan: PropTypes.number,
  onEndReached: PropTypes.func,
  endReachedThreshold: PropTypes.number,
  className: PropTypes.string
};

// Virtualized Grid Component
export const VirtualizedGrid = ({
  items,
  renderItem,
  itemWidth,
  itemHeight,
  height = 400,
  gap = 16,
  overscan = 1,
  onEndReached,
  endReachedThreshold = 200,
  className = '',
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate grid dimensions
  const columnsCount = Math.floor((containerWidth + gap) / (itemWidth + gap));
  const rowHeight = itemHeight + gap;
  const rowsCount = Math.ceil(items.length / columnsCount);
  const totalHeight = rowsCount * rowHeight - gap;

  // Calculate visible range
  const visibleRowsCount = Math.ceil(height / rowHeight);
  const startRowIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRowIndex = Math.min(
    rowsCount,
    Math.floor((scrollTop + height) / rowHeight) + overscan
  );

  // Handle scroll
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setScrollTop(scrollTop);

    // Check if end is reached
    if (
      onEndReached &&
      scrollHeight - scrollTop - clientHeight < endReachedThreshold
    ) {
      onEndReached();
    }
  }, [onEndReached, endReachedThreshold]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  // Attach listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [handleScroll, handleResize]);

  return (
    <div
      ref={containerRef}
      style={{ height, overflow: 'auto' }}
      className={className}
      {...props}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {Array.from({ length: endRowIndex - startRowIndex }).map((_, rowIndex) => {
          const currentRowIndex = startRowIndex + rowIndex;
          const startItemIndex = currentRowIndex * columnsCount;
          const rowItems = items.slice(
            startItemIndex,
            startItemIndex + columnsCount
          );

          return rowItems.map((item, columnIndex) => (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                top: currentRowIndex * rowHeight,
                left: columnIndex * (itemWidth + gap),
                width: itemWidth,
                height: itemHeight
              }}
            >
              {renderItem(item)}
            </div>
          ));
        })}
      </div>
    </div>
  );
};

VirtualizedGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  ).isRequired,
  renderItem: PropTypes.func.isRequired,
  itemWidth: PropTypes.number.isRequired,
  itemHeight: PropTypes.number.isRequired,
  height: PropTypes.number,
  gap: PropTypes.number,
  overscan: PropTypes.number,
  onEndReached: PropTypes.func,
  endReachedThreshold: PropTypes.number,
  className: PropTypes.string
};

// Infinite Scroll Component
export const InfiniteScroll = ({
  items,
  renderItem,
  loadMore,
  hasMore,
  loading,
  threshold = 200,
  className = '',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  // Handle scroll
  const handleScroll = useCallback(async () => {
    if (!hasMore || isLoading) return;

    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      setIsLoading(true);
      await loadMore();
      setIsLoading(false);
    }
  }, [hasMore, isLoading, loadMore, threshold]);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      {...props}
    >
      {items.map(renderItem)}
      {(isLoading || loading) && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      )}
    </div>
  );
};

InfiniteScroll.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  threshold: PropTypes.number,
  className: PropTypes.string
};

export default Virtualized;