import PropTypes from 'prop-types';
import Card from './Card';
import Chart from './Chart';

const Stats = ({
  stats,
  columns = 4,
  showChart = false,
  chartData,
  loading = false,
  className = '',
  ...props
}) => {
  // Grid columns classes
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div
      className={`
        grid gap-4
        ${gridCols[columns]}
        ${className}
      `}
      {...props}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          loading={loading}
          {...stat}
        />
      ))}
      {showChart && chartData && (
        <div className={`col-span-full ${loading ? 'animate-pulse' : ''}`}>
          <Chart {...chartData} />
        </div>
      )}
    </div>
  );
};

Stats.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      change: PropTypes.number,
      icon: PropTypes.node,
      color: PropTypes.string,
      chart: PropTypes.object
    })
  ).isRequired,
  columns: PropTypes.oneOf([1, 2, 3, 4]),
  showChart: PropTypes.bool,
  chartData: PropTypes.object,
  loading: PropTypes.bool,
  className: PropTypes.string
};

// Stat Card Component
const StatCard = ({
  label,
  value,
  change,
  icon,
  color = 'primary',
  chart,
  loading = false,
  className = '',
  ...props
}) => {
  // Color classes
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-100 dark:text-primary-400 dark:bg-primary-900/20',
    secondary: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20',
    success: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    danger: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
    warning: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
    info: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
  };

  return (
    <Card
      className={`
        ${loading ? 'animate-pulse' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Icon */}
          {icon && (
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              {icon}
            </div>
          )}

          {/* Change Indicator */}
          {typeof change === 'number' && (
            <div
              className={`
                flex items-center space-x-1 text-sm font-medium
                ${change >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
                }
              `}
            >
              <i
                className={`fas fa-${change >= 0 ? 'arrow-up' : 'arrow-down'}`}
              />
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {label}
          </h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>

        {/* Chart */}
        {chart && (
          <div className="mt-4">
            <Chart {...chart} height={60} />
          </div>
        )}
      </div>
    </Card>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.number,
  icon: PropTypes.node,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  chart: PropTypes.object,
  loading: PropTypes.bool,
  className: PropTypes.string
};

// Stats List Component
export const StatsList = ({
  stats,
  loading = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        divide-y divide-gray-200 dark:divide-gray-700
        ${loading ? 'animate-pulse' : ''}
        ${className}
      `}
      {...props}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="py-4 flex items-center justify-between"
        >
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.label}
            </h4>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
          {typeof stat.change === 'number' && (
            <div
              className={`
                flex items-center space-x-1 text-sm font-medium
                ${stat.change >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
                }
              `}
            >
              <i
                className={`fas fa-${stat.change >= 0 ? 'arrow-up' : 'arrow-down'}`}
              />
              <span>{Math.abs(stat.change)}%</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

StatsList.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      change: PropTypes.number
    })
  ).isRequired,
  loading: PropTypes.bool,
  className: PropTypes.string
};

// Stats Grid Component
export const StatsGrid = ({
  stats,
  columns = 2,
  loading = false,
  className = '',
  ...props
}) => {
  // Grid columns classes
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  };

  return (
    <div
      className={`
        grid gap-4 sm:gap-6
        ${gridCols[columns]}
        ${loading ? 'animate-pulse' : ''}
        ${className}
      `}
      {...props}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
        >
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {stat.label}
          </h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {stat.value}
          </p>
          {typeof stat.change === 'number' && (
            <div className="mt-2">
              <div
                className={`
                  inline-flex items-center space-x-1 text-sm font-medium
                  ${stat.change >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                  }
                `}
              >
                <i
                  className={`fas fa-${stat.change >= 0 ? 'arrow-up' : 'arrow-down'}`}
                />
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

StatsGrid.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      change: PropTypes.number
    })
  ).isRequired,
  columns: PropTypes.oneOf([2, 3, 4]),
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default Stats;