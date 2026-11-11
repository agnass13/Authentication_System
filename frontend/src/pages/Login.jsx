import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';
import AuthShowcase from '../components/AuthShowcase';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginDemo } = useAuth();

  const prefilledEmail = location.state?.registeredEmail || '';

  const [formData, setFormData] = useState({
    email: prefilledEmail,
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await login(
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.rememberMe
      );

      if (result.success) {
        const redirectPath = location.state?.from?.pathname || '/dashboard';
        navigate(redirectPath, { replace: true });
      } else {
        setServerError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      setServerError(err.message || 'Unable to connect to authentication service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="split-auth-container">
      {/* Floating Theme Customizer */}
      <ThemeSwitcher />

      <div className="split-auth-grid">
        {/* Left Side: System Showcase */}
        <AuthShowcase />

        {/* Right Side: Login Card */}
        <div className="glass-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to verify credentials against SQLite</p>
          </div>

          <AlertMessage
            type="error"
            message={serverError}
            onClose={() => setServerError('')}
          />

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="login-email"
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
              </div>
              <div className="input-icon-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`form-input has-toggle ${errors.password ? 'input-error' : ''}`}
                  autoComplete="current-password"
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
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="form-options">
              <label className="checkbox-label" htmlFor="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="custom-checkbox"
                />
                <span>Remember me</span>
              </label>

              <span
                className="forgot-password-link"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  alert('Password recovery notice: Register a new account or inspect the database in Dashboard.')
                }
              >
                Forgot password?
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo account quick preview */}
          <div className="demo-helper-box">
            <div className="demo-title">
              <Sparkles size={14} color="var(--primary-500)" />
              <span>Assignment Quick Evaluation</span>
            </div>
            <p style={{ marginBottom: '0.65rem' }}>
              Want to preview the dashboard interface instantly without typing credentials?
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.45rem' }}
            >
              ⚡ Instant UI Preview as Demo User
            </button>
          </div>

          {/* Footer switcher to Register */}
          <div className="auth-footer">
            Don't have an account?
            <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
