import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import Input from './Input';
import Dropdown from './Dropdown';
import Pagination from './Pagination';
import Button from './Button';
import { sortByKey } from '../../utils/helpers';

const DataGrid = ({
  data,
  columns,
  loading = false,
  sortable = true,
  filterable = true,
  selectable = false,
  pagination = true,
  itemsPerPage = 10,
  onRowClick,
  onSelectionChange,
  toolbar,
  emptyMessage = 'No data available',
  className = '',
  ...props
}) => {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on search term and column filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search term filter
    if (searchTerm) {
      result = result.filter((item) =>
        columns.some((column) => {
          const value = item[column.key];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply column filters
    Object.keys(filters).forEach((key) => {
      const filterValue = filters[key];
      if (filterValue) {
        result = result.filter((item) => {
          const value = item[key];
          return value && value.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    return result;
  }, [data, columns, searchTerm, filters]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (sortConfig.key) {
      return sortByKey(filteredData, sortConfig.key, sortConfig.direction);
    }
    return filteredData;
  }, [filteredData, sortConfig]);

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    if (pagination) {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return sortedData.slice(start, end);
    }
    return sortedData;
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handle sort
  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value
    }));
    setCurrentPage(1);
  };

  // Handle selection
  const handleSelectionChange = (selectedIds) => {
    setSelectedRows(selectedIds);
    if (onSelectionChange) {
      const selectedItems = data.filter((item) => selectedIds.includes(item.id));
      onSelectionChange(selectedItems);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center space-x-4">
          {filterable && (
            <Input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-xs"
            />
          )}
          {Object.keys(filters).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
        {toolbar && <div>{toolbar}</div>}
      </div>

      {/* Table */}
      <Table
        columns={columns.map((column) => ({
          ...column,
          sortable: sortable && column.sortable !== false,
          header: (
            <div className="space-y-2">
              <div>{column.label}</div>
              {filterable && column.filterable !== false && (
                <Input
                  type="text"
                  size="sm"
                  placeholder={`Filter ${column.label}`}
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                />
              )}
            </div>
          )
        }))}
        data={paginatedData}
        loading={loading}
        sortable={sortable}
        selectable={selectable}
        onSort={handleSort}
        sortConfig={sortConfig}
        selectedRows={selectedRows}
        onSelectionChange={handleSelectionChange}
        onRowClick={onRowClick}
        emptyMessage={emptyMessage}
      />

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

DataGrid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      filterable: PropTypes.bool,
      render: PropTypes.func
    })
  ).isRequired,
  loading: PropTypes.bool,
  sortable: PropTypes.bool,
  filterable: PropTypes.bool,
  selectable: PropTypes.bool,
  pagination: PropTypes.bool,
  itemsPerPage: PropTypes.number,
  onRowClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  toolbar: PropTypes.node,
  emptyMessage: PropTypes.string,
  className: PropTypes.string
};

export default DataGrid;