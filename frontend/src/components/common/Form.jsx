import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../../hooks/useCustomHooks';
import Input from './Input';
import Button from './Button';

const Form = ({
  onSubmit,
  initialValues = {},
  validationSchema,
  children,
  className = '',
  ...props
}) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    reset
  } = useForm(initialValues, validationSchema);

  // Update form values when initialValues change
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues, setValues]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validationSchema) {
      const validationErrors = validationSchema.validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    await onSubmit(values, { reset });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className={`space-y-6 ${className}`}
      noValidate
      {...props}
    >
      {typeof children === 'function'
        ? children({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting: false
          })
        : children}
    </form>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  validationSchema: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  className: PropTypes.string
};

// Form Group Component
export const FormGroup = ({
  children,
  label,
  error,
  required,
  helpText,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helpText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  helpText: PropTypes.string,
  className: PropTypes.string
};

// Form Section Component
export const FormSection = ({
  title,
  description,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  );
};

FormSection.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

// Form Actions Component
export const FormActions = ({
  children,
  align = 'right',
  className = '',
  ...props
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div
      className={`
        flex items-center mt-6 pt-6
        border-t border-gray-200 dark:border-gray-700
        ${alignmentClasses[align]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

FormActions.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right', 'between']),
  className: PropTypes.string
};

// Form Row Component
export const FormRow = ({
  children,
  cols = 1,
  gap = 4,
  className = '',
  ...props
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <div
      className={`
        grid
        ${colClasses[cols]}
        ${gapClasses[gap]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

FormRow.propTypes = {
  children: PropTypes.node.isRequired,
  cols: PropTypes.oneOf([1, 2, 3, 4]),
  gap: PropTypes.oneOf([2, 4, 6, 8]),
  className: PropTypes.string
};

// Search Form Component
export const SearchForm = ({
  onSubmit,
  placeholder = 'Search...',
  buttonText = 'Search',
  className = '',
  ...props
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e.target.search.value);
      }}
      className={`flex space-x-2 ${className}`}
      {...props}
    >
      <Input
        type="search"
        name="search"
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  className: PropTypes.string
};

export default Form;