import React, { useState } from 'react';
import { Building2, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import axiosInstance from '../../apiConfig/axiosConfig';
import { ENDPOINTS } from '../../apiConfig/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";  

const FormField = ({ label, name, type, value, error, children, onChange }) => (
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
        autoComplete="off"
      />
      {children}
    </div>
    {error && <div className="text-danger small mt-1">{error}</div>}
  </div>
);

const UserTypeSelector = ({ setUserTypeAndFormData }) => (
  <div className="p-4">
    <h2 className="text-center text-white mb-4 fs-4">I want to register as:</h2>
    <div className="row g-4">
      <div className="col-md-6">
        <button
          onClick={() => setUserTypeAndFormData('institution')}
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
          onClick={() => setUserTypeAndFormData('individual')}
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
const SignUpForm = ({ 
  userType, 
  setUserType, 
  formData, 
  errors, 
  showPassword, 
  setShowPassword, 
  isSubmitting, 
  handleChange, 
  handleSignupSubmit,
  handleGoogleSuccess 
}) => (
  <div className="p-4">
    <button
      onClick={() => setUserType(null)}
      className="btn btn-link text-warning p-0 mb-4 text-decoration-none"
    >
      <ArrowLeft size={16} className="me-2" />
      Back
    </button>
    <form onSubmit={handleSignupSubmit}>
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
            type={showPassword ? 'text' : 'password'}
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
            type={showPassword ? 'text' : 'password'}
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
          <FormField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            error={errors.phoneNumber}
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
            />
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
            type={showPassword ? 'text' : 'password'}
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
            type={showPassword ? 'text' : 'password'}
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
        <button
          type="submit"
          className="btn btn-warning w-100 mb-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="position-relative mb-3">
          <hr className="text-secondary" />
          <span className="position-absolute top-50 start-50 translate-middle px-3 bg-dark text-secondary">
            or
          </span>
        </div>

        <div className="d-flex justify-content-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Google Sign In Failed');
            }}
            theme="filled_black"
            shape="pill"
            text="signup_with"
            size="large"
          />
        </div>
      </div>

      {errors.submit && (
        <div className="alert alert-danger mt-3">{errors.submit}</div>
      )}

      <p className="text-center text-secondary small mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-warning text-decoration-none">
          Sign in
        </a>
      </p>
    </form>
  </div>
);

const SignUp = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const setUserTypeAndFormData = (type) => {
    setUserType(type);
    setFormData(prev => ({ ...prev, type }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Handle phone number formatting
    if (name === 'phoneNumber') {
      newValue = value.replace(/[^\d]/g, '').slice(0, 15);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation
    const phoneRegex = /^\d{10,15}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be between 10 and 15 digits';
    }

    if (formData.type === 'institution') {
      if (!formData.name) newErrors.name = 'Institution name is required';
      if (!formData.country) newErrors.country = 'Country is required';
    } else {
      if (!formData.username) newErrors.username = 'Username is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const signupUser = async (userData) => {
  try {
    setIsSubmitting(true);
    // Use the correct endpoint names from api.js
    const endpoint = formData.type === 'institution' 
      ? ENDPOINTS.ORGANIZER_SIGNUP 
      : ENDPOINTS.USER_SIGNUP;

    console.log('Using endpoint:', endpoint); // Debug log

    const response = await axiosInstance.post(endpoint, userData);

    if (response.data) {
      console.log('Signup successful:', response.data);
      localStorage.setItem('signupSuccess', 'true');
      navigate('/login');
    }
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    
    let errorMessage = 'Sign up failed. Please try again.';
    
    if (error.response?.data) {
      if (error.response.data.user) {
        const userErrors = error.response.data.user;
        const fieldErrors = {};
        
        Object.entries(userErrors).forEach(([key, value]) => {
          const errorMessage = Array.isArray(value) ? value[0] : value;
          fieldErrors[key === 'mobile_number' ? 'phoneNumber' : key] = errorMessage;
        });
        
        setErrors(prev => ({ ...prev, ...fieldErrors }));
      }
      errorMessage = 'Please correct the errors in the form.';
    }
    
    setErrors(prev => ({
      ...prev,
      submit: errorMessage
    }));
  } finally {
    setIsSubmitting(false);
  }
};
const handleGoogleSuccess = async (credentialResponse) => {
    try {
        setIsSubmitting(true);
        const decoded = jwtDecode(credentialResponse.credential);
        
        // Create request data matching backend expectations
        const requestData = {
            credential: credentialResponse.credential,
            user_info: {
                email: decoded.email,
                name: decoded.name,
                given_name: decoded.given_name,
                family_name: decoded.family_name,
                picture: decoded.picture
            }
        };

        console.log('Sending Google signup request:', requestData);

        const endpoint = userType === 'institution' 
            ? ENDPOINTS.ORGANIZER_SIGNUP_GOOGLE 
            : ENDPOINTS.USER_SIGNUP_GOOGLE;

        const response = await axiosInstance.post(endpoint, requestData);

        if (response?.data?.status === 'success') {
            localStorage.setItem('signupSuccess', 'true');
            navigate('/login', { 
                state: { 
                    message: 'Account created successfully! Please login.',
                    email: decoded.email
                }
            });
        } else {
            throw new Error(response?.data?.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Google signup error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        setErrors({
            submit: error.response?.data?.message || 
                   error.response?.data?.error || 
                   'Failed to signup with Google. Please try again.'
        });
    } finally {
        setIsSubmitting(false);
    }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (formData.type === 'institution') {
          const organizerData = {
            user: {
              username: formData.email.split('@')[0],
              email: formData.email,
              password: formData.password,
              password_confirm: formData.confirmPassword,
              mobile_number: formData.phoneNumber
            },
            company_name: formData.name,
            country: formData.country,
            description: formData.companyDescription || ''
          };
          await signupUser(organizerData);
        } else {
          const userData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            password_confirm: formData.confirmPassword,
            mobile_number: formData.phoneNumber
          };
          await signupUser(userData);
        }
      } catch (error) {
        console.log('Form submission failed');
      }
    }
  };
 
  return (
 <div className="container-fluid py-5">
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="bg-dark border border-secondary rounded-3 shadow">
          <div className="p-4 text-center border-bottom border-secondary">
            <h1 className="h3 text-warning mb-2">EasyTicket</h1>
            <p className="text-secondary mb-0">Create your account</p>
          </div>
          {!userType ? (
            <UserTypeSelector setUserTypeAndFormData={setUserTypeAndFormData} />
          ) : (
      <SignUpForm
        userType={userType}
        setUserType={setUserType}
        formData={formData}
        errors={errors}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        isSubmitting={isSubmitting}
        handleChange={handleChange}
        handleSignupSubmit={handleSubmit}
        handleGoogleSuccess={handleGoogleSuccess}
      />
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default SignUp;