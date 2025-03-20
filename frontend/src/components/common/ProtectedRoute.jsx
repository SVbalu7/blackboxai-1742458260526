import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is specified and user's role doesn't match, redirect to their dashboard
  if (role && user.role !== role) {
    const dashboardRoutes = {
      admin: '/admin/dashboard',
      faculty: '/faculty/dashboard',
      student: '/student/dashboard'
    };

    return <Navigate to={dashboardRoutes[user.role]} replace />;
  }

  // Check device login limitations for faculty and students
  if (user.role !== 'admin') {
    const deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      // Generate and store a unique device ID if not exists
      const newDeviceId = crypto.randomUUID();
      localStorage.setItem('deviceId', newDeviceId);
    }

    // For students without subscription, check if this is their only device
    if (user.role === 'student' && !user.subscription?.isActive) {
      if (user.activeDevices?.length > 1) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 text-center">
              <div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Device Limit Reached
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  You can only use one device at a time with a free account.
                  Please upgrade to premium for multiple device access.
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.href = '/student/subscription'}
                  className="btn-primary w-full"
                >
                  Upgrade to Premium
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }}
                  className="mt-4 btn-secondary w-full"
                >
                  Login on This Device
                </button>
              </div>
            </div>
          </div>
        );
      }
    }

    // For faculty, check if they're within the two-device limit
    if (user.role === 'faculty' && user.activeDevices?.length > 2) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Device Limit Reached
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Faculty accounts are limited to one mobile device and one desktop device.
                Please log out from another device to continue.
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                className="btn-primary w-full"
              >
                Login on This Device
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // If all checks pass, render the protected content
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.oneOf(['admin', 'faculty', 'student'])
};

export default ProtectedRoute;