import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const Masonry = ({
  items,
  renderItem,
  columnWidth = 300,
  gap = 16,
  minColumns = 1,
  maxColumns = Infinity,
  className = '',
  ...props
}) => {
  const [columns, setColumns] = useState([]);
  const containerRef = useRef(null);

  // Calculate number of columns based on container width
  const calculateColumns = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const columnsCount = Math.min(
      maxColumns,
      Math.max(
        minColumns,
        Math.floor((containerWidth + gap) / (columnWidth + gap))
      )
    );

    // Initialize columns array
    const newColumns = Array.from({ length: columnsCount }, () => []);
    const columnHeights = Array(columnsCount).fill(0);

    // Distribute items among columns
    items.forEach((item) => {
      // Find shortest column
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      newColumns[shortestColumn].push(item);
      columnHeights[shortestColumn] += item.height || 0;
    });

    setColumns(newColumns);
  }, [items, columnWidth, gap, minColumns, maxColumns]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      calculateColumns();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [calculateColumns]);

  // Recalculate on items change
  useEffect(() => {
    calculateColumns();
  }, [items, calculateColumns]);

  return (
    <div
      ref={containerRef}
      className={`
        grid
        gap-${gap / 4}
        ${className}
      `}
      style={{
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`
      }}
      {...props}
    >
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={`flex flex-col gap-${gap / 4}`}
        >
          {column.map((item) => renderItem(item))}
        </div>
      ))}
    </div>
  );
};

Masonry.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      height: PropTypes.number
    })
  ).isRequired,
  renderItem: PropTypes.func.isRequired,
  columnWidth: PropTypes.number,
  gap: PropTypes.number,
  minColumns: PropTypes.number,
  maxColumns: PropTypes.number,
  className: PropTypes.string
};

// Image Masonry Component
export const ImageMasonry = ({
  images,
  aspectRatio = 1,
  loading = 'lazy',
  onImageClick,
  ...props
}) => {
  // Calculate image heights based on aspect ratio
  const itemsWithHeight = images.map((image) => ({
    ...image,
    height: image.width ? image.width / aspectRatio : 300
  }));

  return (
    <Masonry
      items={itemsWithHeight}
      renderItem={(image) => (
        <div
          key={image.id}
          className={`
            relative overflow-hidden rounded-lg
            ${onImageClick ? 'cursor-pointer' : ''}
            transition-transform duration-200 hover:scale-[1.02]
          `}
          onClick={() => onImageClick && onImageClick(image)}
        >
          <img
            src={image.src}
            alt={image.alt || ''}
            loading={loading}
            className="w-full h-auto object-cover"
          />
          {image.overlay && (
            <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 hover:opacity-100 transition-opacity duration-200">
              {image.overlay}
            </div>
          )}
        </div>
      )}
      {...props}
    />
  );
};

ImageMasonry.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
      width: PropTypes.number,
      overlay: PropTypes.node
    })
  ).isRequired,
  aspectRatio: PropTypes.number,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  onImageClick: PropTypes.func
};

// Card Masonry Component
export const CardMasonry = ({
  items,
  renderCard,
  ...props
}) => {
  // Calculate card heights based on content
  const itemsWithHeight = items.map((item) => ({
    ...item,
    height: 300 // Default height, adjust based on content
  }));

  return (
    <Masonry
      items={itemsWithHeight}
      renderItem={(item) => (
        <div
          key={item.id}
          className="
            bg-white dark:bg-gray-800
            rounded-lg shadow-md
            overflow-hidden
            transition-transform duration-200
            hover:shadow-lg hover:scale-[1.02]
          "
        >
          {renderCard(item)}
        </div>
      )}
      {...props}
    />
  );
};

CardMasonry.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  ).isRequired,
  renderCard: PropTypes.func.isRequired
};

// Responsive Masonry Component
export const ResponsiveMasonry = ({
  breakpoints = {
    default: { columnWidth: 300, columns: 4 },
    lg: { columnWidth: 280, columns: 3 },
    md: { columnWidth: 260, columns: 2 },
    sm: { columnWidth: 240, columns: 1 }
  },
  ...props
}) => {
  const [config, setConfig] = useState(breakpoints.default);

  // Update configuration based on window width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280 && breakpoints.xl) {
        setConfig(breakpoints.xl);
      } else if (width >= 1024 && breakpoints.lg) {
        setConfig(breakpoints.lg);
      } else if (width >= 768 && breakpoints.md) {
        setConfig(breakpoints.md);
      } else if (width >= 640 && breakpoints.sm) {
        setConfig(breakpoints.sm);
      } else {
        setConfig(breakpoints.default);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  return (
    <Masonry
      columnWidth={config.columnWidth}
      maxColumns={config.columns}
      {...props}
    />
  );
};

ResponsiveMasonry.propTypes = {
  breakpoints: PropTypes.shape({
    default: PropTypes.shape({
      columnWidth: PropTypes.number,
      columns: PropTypes.number
    }).isRequired,
    xl: PropTypes.shape({
      columnWidth: PropTypes.number,
      columns: PropTypes.number
    }),
    lg: PropTypes.shape({
      columnWidth: PropTypes.number,
      columns: PropTypes.number
    }),
    md: PropTypes.shape({
      columnWidth: PropTypes.number,
      columns: PropTypes.number
    }),
    sm: PropTypes.shape({
      columnWidth: PropTypes.number,
      columns: PropTypes.number
    })
  })
};

export default Masonry;