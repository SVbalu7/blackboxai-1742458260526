import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    registrationNumber: '', // For students
    employeeId: '', // For faculty
    designation: '', // For faculty
    department: '', // For faculty
    batchYear: new Date().getFullYear(), // For students
  });

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (formData.role === 'student' && !formData.registrationNumber) {
      errors.push('Registration number is required for students');
    }

    if (formData.role === 'faculty') {
      if (!formData.employeeId) errors.push('Employee ID is required for faculty');
      if (!formData.designation) errors.push('Designation is required for faculty');
      if (!formData.department) errors.push('Department is required for faculty');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    setIsLoading(true);

    try {
      // Remove confirmPassword and any role-specific fields that aren't needed
      const userData = { ...formData };
      delete userData.confirmPassword;

      if (userData.role === 'student') {
        delete userData.employeeId;
        delete userData.designation;
        delete userData.department;
      } else if (userData.role === 'faculty') {
        delete userData.registrationNumber;
        delete userData.batchYear;
      } else {
        // Admin registration might be restricted
        delete userData.registrationNumber;
        delete userData.employeeId;
        delete userData.designation;
        delete userData.department;
        delete userData.batchYear;
      }

      const user = await register(userData);
      toast.success('Registration successful!');
      navigate(`/${user.role}/dashboard`);
    } catch (error) {
      console.error('Registration error:', error);
      // Error is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="input mt-1"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="input mt-1"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input mt-1"
                placeholder="john@example.com"
              />
            </div>

            {/* Role-specific fields */}
            {formData.role === 'student' && (
              <>
                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                    Registration Number
                  </label>
                  <input
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    required
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="e.g., 2023CS001"
                  />
                </div>

                <div>
                  <label htmlFor="batchYear" className="block text-sm font-medium text-gray-700">
                    Batch Year
                  </label>
                  <select
                    id="batchYear"
                    name="batchYear"
                    required
                    value={formData.batchYear}
                    onChange={handleChange}
                    className="input mt-1"
                  >
                    {[...Array(4)].map((_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </>
            )}

            {formData.role === 'faculty' && (
              <>
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                    Employee ID
                  </label>
                  <input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    required
                    value={formData.employeeId}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="e.g., FAC001"
                  />
                </div>

                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <input
                    id="designation"
                    name="designation"
                    type="text"
                    required
                    value={formData.designation}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="e.g., Assistant Professor"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="e.g., Computer Science"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input mt-1"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input mt-1"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`btn-primary w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          By registering, you agree to our{' '}
          <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;