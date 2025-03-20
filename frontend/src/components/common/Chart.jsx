import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Pie, PolarArea } from 'react-chartjs-2';
import { useTheme } from '../../contexts/ThemeContext';
import Card from './Card';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Chart = ({
  type = 'line',
  data,
  options = {},
  height = 300,
  title,
  loading = false,
  error = null,
  className = '',
  ...props
}) => {
  const chartRef = useRef(null);
  const { isDark } = useTheme();

  // Default chart options based on theme
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#e5e7eb' : '#374151'
        }
      },
      title: {
        display: !!title,
        text: title,
        color: isDark ? '#e5e7eb' : '#374151'
      }
    },
    scales: type === 'line' || type === 'bar' ? {
      x: {
        grid: {
          color: isDark ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: isDark ? '#e5e7eb' : '#374151'
        }
      },
      y: {
        grid: {
          color: isDark ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: isDark ? '#e5e7eb' : '#374151'
        }
      }
    } : undefined
  };

  // Merge default options with provided options
  const chartOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins
    }
  };

  // Update chart on theme change
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [isDark]);

  // Render appropriate chart type
  const renderChart = () => {
    const commonProps = {
      ref: chartRef,
      data,
      options: chartOptions,
      height,
      ...props
    };

    switch (type) {
      case 'line':
        return <Line {...commonProps} />;
      case 'bar':
        return <Bar {...commonProps} />;
      case 'doughnut':
        return <Doughnut {...commonProps} />;
      case 'pie':
        return <Pie {...commonProps} />;
      case 'polar':
        return <PolarArea {...commonProps} />;
      default:
        return <Line {...commonProps} />;
    }
  };

  return (
    <Card
      className={`p-4 ${className}`}
      style={{ height: height + 80 }} // Add padding for title and legend
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-500">
          {error}
        </div>
      ) : (
        renderChart()
      )}
    </Card>
  );
};

Chart.propTypes = {
  type: PropTypes.oneOf(['line', 'bar', 'doughnut', 'pie', 'polar']),
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
  height: PropTypes.number,
  title: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

// Line Chart Component
export const LineChart = (props) => <Chart type="line" {...props} />;

// Bar Chart Component
export const BarChart = (props) => <Chart type="bar" {...props} />;

// Doughnut Chart Component
export const DoughnutChart = (props) => <Chart type="doughnut" {...props} />;

// Pie Chart Component
export const PieChart = (props) => <Chart type="pie" {...props} />;

// Polar Area Chart Component
export const PolarAreaChart = (props) => <Chart type="polar" {...props} />;

// Stats Chart Component
export const StatsChart = ({
  title,
  value,
  change,
  changeType = 'increase',
  data,
  type = 'line',
  height = 100,
  className = '',
  ...props
}) => {
  const defaultOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        {change && (
          <span
            className={`
              inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium
              ${
                changeType === 'increase'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }
            `}
          >
            {changeType === 'increase' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <Chart
        type={type}
        data={data}
        options={defaultOptions}
        height={height}
        {...props}
      />
    </Card>
  );
};

StatsChart.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  changeType: PropTypes.oneOf(['increase', 'decrease']),
  data: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['line', 'bar']),
  height: PropTypes.number,
  className: PropTypes.string
};

export default Chart;