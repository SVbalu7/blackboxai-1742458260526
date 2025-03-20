import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { sortByKey } from '../../utils/helpers';
import { LoadingSpinner } from '../../contexts/LoadingContext';

const Table = ({
  columns,
  data,
  loading = false,
  sortable = true,
  selectable = false,
  pagination = true,
  itemsPerPage = 10,
  onRowClick,
  onSelectionChange,
  emptyMessage = 'No data available',
  className = '',
  ...props
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);

  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Handle row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) => {
      const newSelected = prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id];

      if (onSelectionChange) {
        onSelectionChange(newSelected);
      }

      return newSelected;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    setSelectedRows((prevSelected) => {
      const allIds = data.map((row) => row.id);
      const newSelected = prevSelected.length === data.length ? [] : allIds;

      if (onSelectionChange) {
        onSelectionChange(newSelected);
      }

      return newSelected;
    });
  };

  // Sort and paginate data
  const sortedData = useMemo(() => {
    let processedData = [...data];

    if (sortConfig.key) {
      processedData = sortByKey(processedData, sortConfig.key, sortConfig.direction);
    }

    if (pagination) {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return processedData.slice(start, end);
    }

    return processedData;
  }, [data, sortConfig, currentPage, pagination, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Generate pagination buttons
  const paginationButtons = useMemo(() => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`
            px-3 py-1 rounded-md text-sm font-medium
            ${currentPage === i
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }
          `}
        >
          {i}
        </button>
      );
    }
    return buttons;
  }, [currentPage, totalPages]);

  return (
    <div className={`overflow-x-auto ${className}`} {...props}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {selectable && (
              <th className="px-6 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                  dark:text-gray-400
                  ${sortable && column.sortable !== false ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200' : ''}
                `}
              >
                <div className="flex items-center">
                  {column.label}
                  {sortable && column.sortable !== false && sortConfig.key === column.key && (
                    <span className="ml-2">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {loading ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center"
              >
                <div className="flex justify-center">
                  <LoadingSpinner />
                </div>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr
                key={row.id || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={`
                  ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                  ${selectedRows.includes(row.id) ? 'bg-primary-50 dark:bg-primary-900' : ''}
                `}
              >
                {selectable && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-secondary"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, data.length)}
                </span>{' '}
                of <span className="font-medium">{data.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {paginationButtons}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  sortable: PropTypes.bool,
  selectable: PropTypes.bool,
  pagination: PropTypes.bool,
  itemsPerPage: PropTypes.number,
  onRowClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  emptyMessage: PropTypes.string,
  className: PropTypes.string
};

export default Table;