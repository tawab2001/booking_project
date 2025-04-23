import React, { useState, useEffect, useCallback } from 'react';
import { Building2, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

// FormField component for reusable form inputs
const FormField = React.memo(({ label, name, type, value, error, children, onChange }) => (
  <div className="mb-3">
    <label className="form-label text-white">{label}</label>
    <div className="position-relative">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="form-control bg-dark text-white border-secondary"
      />
      {children}
    </div>
    {error && <div className="text-danger small mt-1">{error}</div>}
  </div>
));

const SignUp = () => {
  const [userType, setUserType] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    country: '',
    companyDescription: '',
    username: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(prev => ({ ...prev, type: userType }));
  }, [userType]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.type === 'institution') {
      if (!formData.name) newErrors.name = 'Institution name is required';
      if (!formData.country) newErrors.country = 'Country is required';
    } else {
      if (!formData.username) newErrors.username = 'Username is required';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Submitting user data:', formData);
      alert('Sign up successful!');
    }
  };

  const UserTypeSelector = () => (
    <div className="p-4">
      <h2 className="text-center text-white mb-4 fs-4">I want to register as:</h2>
      <div className="row g-4">
        <div className="col-md-6">
          <button
            onClick={() => setUserType('institution')}
            className="btn btn-outline-warning w-100 h-100 p-4 d-flex flex-column align-items-center"
          >
            <div className="bg-dark rounded-circle p-4 mb-3">
              <Building2 className="text-warning" size={32} />
            </div>
            <h3 className="fs-5 text-white mb-2">Institution</h3>
            <p className="text-secondary small text-center mb-0">
              Register your company or organization
            </p>
          </button>
        </div>
        <div className="col-md-6">
          <button
            onClick={() => setUserType('individual')}
            className="btn btn-outline-warning w-100 h-100 p-4 d-flex flex-column align-items-center"
          >
            <div className="bg-dark rounded-circle p-4 mb-3">
              <User className="text-warning" size={32} />
            </div>
            <h3 className="fs-5 text-white mb-2">Individual</h3>
            <p className="text-secondary small text-center mb-0">
              Register as an individual user
            </p>
          </button>
        </div>
      </div>
    </div>
  );

  const SignUpForm = () => (
    <div className="p-4">
      <button
        onClick={() => setUserType(null)}
        className="btn btn-link text-warning p-0 mb-4 text-decoration-none"
      >
        <ArrowLeft size={16} className="me-2" />
        Back
      </button>

      <form onSubmit={handleSubmit}>
        {userType === 'institution' ? (
          <>
            <FormField 
              label="Institution Name" 
              name="name" 
              type="text" 
              value={formData.name} 
              error={errors.name} 
              onChange={handleChange} 
            />
            <FormField 
              label="Email Address" 
              name="email" 
              type="email" 
              value={formData.email} 
              error={errors.email} 
              onChange={handleChange} 
            />
            <FormField 
              label="Password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              value={formData.password} 
              error={errors.password} 
              onChange={handleChange}
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-secondary"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </FormField>
            <FormField 
              label="Confirm Password" 
              name="confirmPassword" 
              type={showPassword ? "text" : "password"} 
              value={formData.confirmPassword} 
              error={errors.confirmPassword} 
              onChange={handleChange} 
            />
            <FormField 
              label="Country" 
              name="country" 
              type="text" 
              value={formData.country} 
              error={errors.country} 
              onChange={handleChange} 
            />
            <div className="mb-3">
              <label className="form-label text-white">Company Description</label>
              <textarea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                className="form-control bg-dark text-white border-secondary"
                rows={4}
              ></textarea>
            </div>
          </>
        ) : (
          <>
            <FormField 
              label="Username" 
              name="username" 
              type="text" 
              value={formData.username} 
              error={errors.username} 
              onChange={handleChange} 
            />
            <FormField 
              label="Email Address" 
              name="email" 
              type="email" 
              value={formData.email} 
              error={errors.email} 
              onChange={handleChange} 
            />
            <FormField 
              label="Password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              value={formData.password} 
              error={errors.password} 
              onChange={handleChange}
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-secondary"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </FormField>
            <FormField 
              label="Confirm Password" 
              name="confirmPassword" 
              type={showPassword ? "text" : "password"} 
              value={formData.confirmPassword} 
              error={errors.confirmPassword} 
              onChange={handleChange} 
            />
            <FormField 
              label="Phone Number" 
              name="phoneNumber" 
              type="tel" 
              value={formData.phoneNumber} 
              error={errors.phoneNumber} 
              onChange={handleChange} 
            />
          </>
        )}

        <div className="mt-4">
          <button type="submit" className="btn btn-warning w-100">
            Create Account
          </button>
        </div>

        <p className="text-center text-secondary small mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-warning text-decoration-none">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="bg-dark border border-secondary rounded-3 shadow">
            <div className="p-4 text-center border-bottom border-secondary">
              <h1 className="h3 text-warning mb-2">EasyTicket</h1>
              <p className="text-secondary mb-0">Create your account</p>
            </div>
            {!userType ? <UserTypeSelector /> : <SignUpForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
