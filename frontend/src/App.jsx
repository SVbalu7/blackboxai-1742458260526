import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LoadingProvider } from './contexts/LoadingContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAnalytics from './pages/admin/Analytics';
import FacultyManagement from './pages/admin/FacultyManagement';
import StudentManagement from './pages/admin/StudentManagement';

// Faculty Pages
import FacultyDashboard from './pages/faculty/Dashboard';
import MarkAttendance from './pages/faculty/MarkAttendance';
import AttendanceRecords from './pages/faculty/AttendanceRecords';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentAnalytics from './pages/student/Analytics';
import StudentAttendance from './pages/student/Attendance';

// Layouts
import AdminLayout from './components/layouts/AdminLayout';
import FacultyLayout from './components/layouts/FacultyLayout';
import StudentLayout from './components/layouts/StudentLayout';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <LoadingProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="faculty" element={<FacultyManagement />} />
                  <Route path="students" element={<StudentManagement />} />
                </Route>

                {/* Faculty Routes */}
                <Route
                  path="/faculty"
                  element={
                    <ProtectedRoute role="faculty">
                      <FacultyLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<FacultyDashboard />} />
                  <Route path="mark-attendance" element={<MarkAttendance />} />
                  <Route path="attendance" element={<AttendanceRecords />} />
                </Route>

                {/* Student Routes */}
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute role="student">
                      <StudentLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="analytics" element={<StudentAnalytics />} />
                  <Route path="attendance" element={<StudentAttendance />} />
                </Route>

                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400">
                          404
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                          Page not found
                        </p>
                        <button
                          onClick={() => window.history.back()}
                          className="mt-6 btn-primary"
                        >
                          Go Back
                        </button>
                      </div>
                    </div>
                  }
                />
              </Routes>

              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    theme: {
                      primary: '#059669',
                    },
                  },
                  error: {
                    duration: 4000,
                    theme: {
                      primary: '#DC2626',
                    },
                  },
                }}
              />
            </Router>
          </LoadingProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;