import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const Spreadsheet = ({
  data,
  columns,
  onChange,
  readOnly = false,
  showRowNumbers = true,
  showColumnHeaders = true,
  height = '400px',
  className = '',
  ...props
}) => {
  const [activeCell, setActiveCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [selectedRange, setSelectedRange] = useState(null);

  // Handle cell click
  const handleCellClick = (rowIndex, colIndex) => {
    if (readOnly) return;

    setActiveCell({ rowIndex, colIndex });
    setEditValue(data[rowIndex][columns[colIndex].key]);
  };

  // Handle cell double click
  const handleCellDoubleClick = (rowIndex, colIndex) => {
    if (readOnly) return;

    setActiveCell({ rowIndex, colIndex, editing: true });
    setEditValue(data[rowIndex][columns[colIndex].key]);
  };

  // Handle cell edit
  const handleCellEdit = (value) => {
    setEditValue(value);
  };

  // Handle cell blur
  const handleCellBlur = () => {
    if (!activeCell) return;

    const { rowIndex, colIndex } = activeCell;
    const newData = [...data];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columns[colIndex].key]: editValue
    };

    onChange(newData);
    setActiveCell(null);
  };

  // Handle key navigation
  const handleKeyDown = useCallback((e) => {
    if (!activeCell) return;

    const { rowIndex, colIndex, editing } = activeCell;

    switch (e.key) {
      case 'Enter':
        if (editing) {
          handleCellBlur();
        } else {
          setActiveCell({ ...activeCell, editing: true });
        }
        break;
      case 'Escape':
        if (editing) {
          setActiveCell({ ...activeCell, editing: false });
          setEditValue(data[rowIndex][columns[colIndex].key]);
        } else {
          setActiveCell(null);
        }
        break;
      case 'Tab':
        e.preventDefault();
        if (colIndex < columns.length - 1) {
          handleCellClick(rowIndex, colIndex + 1);
        } else if (rowIndex < data.length - 1) {
          handleCellClick(rowIndex + 1, 0);
        }
        break;
      case 'ArrowUp':
        if (!editing && rowIndex > 0) {
          handleCellClick(rowIndex - 1, colIndex);
        }
        break;
      case 'ArrowDown':
        if (!editing && rowIndex < data.length - 1) {
          handleCellClick(rowIndex + 1, colIndex);
        }
        break;
      case 'ArrowLeft':
        if (!editing && colIndex > 0) {
          handleCellClick(rowIndex, colIndex - 1);
        }
        break;
      case 'ArrowRight':
        if (!editing && colIndex < columns.length - 1) {
          handleCellClick(rowIndex, colIndex + 1);
        }
        break;
      default:
        break;
    }
  }, [activeCell, columns, data, editValue]);

  // Attach keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Format cell value based on type
  const formatCellValue = (value, type) => {
    switch (type) {
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      case 'date':
        return value instanceof Date ? value.toLocaleDateString() : value;
      case 'boolean':
        return value ? '✓' : '✗';
      default:
        return value;
    }
  };

  return (
    <div
      className={`
        overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg
        ${className}
      `}
      style={{ height }}
      {...props}
    >
      <table className="w-full border-collapse">
        {/* Column Headers */}
        {showColumnHeaders && (
          <thead>
            <tr>
              {showRowNumbers && (
                <th className="
                  sticky top-0 z-10
                  bg-gray-50 dark:bg-gray-800
                  border-b border-r border-gray-200 dark:border-gray-700
                  px-4 py-2
                  text-left text-xs font-medium text-gray-500 dark:text-gray-400
                  uppercase tracking-wider
                " />
              )}
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`
                    sticky top-0 z-10
                    bg-gray-50 dark:bg-gray-800
                    border-b border-r border-gray-200 dark:border-gray-700
                    px-4 py-2
                    text-left text-xs font-medium text-gray-500 dark:text-gray-400
                    uppercase tracking-wider
                    ${column.width ? '' : 'min-w-[150px]'}
                  `}
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.title || column.key}
                </th>
              ))}
            </tr>
          </thead>
        )}

        {/* Data Rows */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {showRowNumbers && (
                <td className="
                  border-b border-r border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-800
                  px-4 py-2
                  text-sm text-gray-500 dark:text-gray-400
                ">
                  {rowIndex + 1}
                </td>
              )}
              {columns.map((column, colIndex) => {
                const isActive = activeCell?.rowIndex === rowIndex && activeCell?.colIndex === colIndex;
                const isEditing = isActive && activeCell?.editing;

                return (
                  <td
                    key={column.key}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                    className={`
                      relative
                      border-b border-r border-gray-200 dark:border-gray-700
                      px-4 py-2
                      ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-900'}
                      ${readOnly ? '' : 'cursor-cell'}
                    `}
                  >
                    {isEditing ? (
                      <input
                        type={column.type === 'number' ? 'number' : 'text'}
                        value={editValue}
                        onChange={(e) => handleCellEdit(e.target.value)}
                        onBlur={handleCellBlur}
                        className="
                          absolute inset-0 w-full h-full
                          px-4 py-2
                          border-2 border-blue-500
                          focus:outline-none
                          bg-white dark:bg-gray-900
                          text-gray-900 dark:text-white
                        "
                        autoFocus
                      />
                    ) : (
                      <div className="truncate text-sm text-gray-900 dark:text-white">
                        {formatCellValue(row[column.key], column.type)}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Spreadsheet.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string,
      type: PropTypes.oneOf(['text', 'number', 'date', 'boolean']),
      width: PropTypes.string
    })
  ).isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  showRowNumbers: PropTypes.bool,
  showColumnHeaders: PropTypes.bool,
  height: PropTypes.string,
  className: PropTypes.string
};

// Editable Grid Component
export const EditableGrid = ({
  data,
  columns,
  onAdd,
  onDelete,
  ...props
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={onAdd}
        >
          <i className="fas fa-plus mr-2" />
          Add Row
        </Button>
      </div>
      <Spreadsheet
        data={data}
        columns={[
          ...columns,
          {
            key: 'actions',
            title: 'Actions',
            width: '100px',
            render: (_, rowIndex) => (
              <button
                onClick={() => onDelete(rowIndex)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <i className="fas fa-trash" />
              </button>
            )
          }
        ]}
        {...props}
      />
    </div>
  );
};

EditableGrid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string,
      type: PropTypes.oneOf(['text', 'number', 'date', 'boolean']),
      width: PropTypes.string
    })
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default Spreadsheet;