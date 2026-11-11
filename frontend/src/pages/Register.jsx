import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthMeter, { evaluatePasswordStrength } from '../components/PasswordStrengthMeter';
import AlertMessage from '../components/AlertMessage';
import AuthShowcase from '../components/AuthShowcase';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { Shield, User, Mail, Lock, Eye, EyeOff, UserPlus, Check, X } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field change handler with instant error clearing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  // Real-time password match calculation
  const hasTypedConfirm = formData.confirmPassword.length > 0;
  const isMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else {
      const { score } = evaluatePasswordStrength(formData.password);
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long.';
      } else if (score < 2) {
        newErrors.password = 'Please choose a stronger password.';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await register(
        formData.name.trim(),
        formData.email.trim().toLowerCase(),
        formData.password
      );

      if (result.success) {
        setSuccessMessage(result.message || 'Registration completed successfully! Redirecting to login...');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        
        setTimeout(() => {
          navigate('/login', { state: { registeredEmail: formData.email } });
        }, 1800);
      } else {
        setServerError(result.message);
      }
    } catch (err) {
      setServerError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="split-auth-container">
      {/* Floating Theme Customizer */}
      <ThemeSwitcher />

      <div className="split-auth-grid">
        {/* Left Side: Interactive System Showcase */}
        <AuthShowcase />

        {/* Right Side: The Registration Glass Card */}
        <div className="glass-card">
          <div className="auth-header">
            <h1 className="auth-title">Create an Account</h1>
            <p className="auth-subtitle">Register new user credentials in the SQLite database</p>
          </div>

          <AlertMessage
            type="error"
            message={serverError}
            onClose={() => setServerError('')}
          />

          <AlertMessage
            type="success"
            message={successMessage}
          />

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">
                Full Name
              </label>
              <div className="input-icon-wrapper">
                <User className="input-icon" size={18} />
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  autoComplete="name"
                  disabled={isSubmitting}
                />
              </div>
              {errors.name && <span className="field-error-text">{errors.name}</span>}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-email">
                Email Address
              </label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && <span className="field-error-text">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-password">
                Password
              </label>
              <div className="input-icon-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`form-input has-toggle ${errors.password ? 'input-error' : ''}`}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="field-error-text">{errors.password}</span>}

              {/* Real-time Password Strength Meter */}
              <PasswordStrengthMeter password={formData.password} />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="register-confirm-password">
                  Confirm Password
                </label>
                {hasTypedConfirm && (
                  <span className={`password-match-badge ${isMatch ? 'match-success' : 'match-mismatch'}`}>
                    {isMatch ? <Check size={13} /> : <X size={13} />}
                    {isMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                )}
              </div>
              <div className="input-icon-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`form-input has-toggle ${errors.confirmPassword ? 'input-error' : ''}`}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="field-error-text">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ marginTop: '1.25rem' }}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" />
                  <span>Registering to SQLite...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer switcher to Login */}
          <div className="auth-footer">
            Already have an account?
            <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
