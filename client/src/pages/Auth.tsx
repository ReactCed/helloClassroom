import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { setEmail, setIsLogin, setPass, setName, setAddress, setConPass, setRole, setCaptchaValue, submitLoginSlice, submitSignupSlice } from '../store/slice/authSlice';
import '../assets/css/Auth.css';
import ReCAPTCHA from 'react-google-recaptcha';

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const email = useSelector((state: RootState) => state.auth.email);
  const pass = useSelector((state: RootState) => state.auth.pass);
  const name = useSelector((state: RootState) => state.auth.name);
  const address = useSelector((state: RootState) => state.auth.address);
  const conPass = useSelector((state: RootState) => state.auth.conPass);
  const role = useSelector((state: RootState) => state.auth.role);
  const captchaValue = useSelector((state: RootState) => state.auth.captchaValue);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ✅ FIX: Only strip < and >, keep spaces while typing
  const sanitize = (value: string) => value.replace(/[<>]/g, '');

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'email':
        return !value.includes('@') ? 'Invalid email format' : '';
      case 'pass':
        return value.length < 6 ? 'Password must be at least 6 characters' : '';
      case 'name':
        return value.trim().length === 0 ? 'Name is required' : '';
      case 'address':
        return value.trim().length === 0 ? 'Address is required' : '';
      case 'conPass':
        return value !== pass ? 'Passwords do not match' : '';
      case 'role':
        return !value ? 'Role is required' : '';
      default:
        return '';
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {
      email: validateField('email', email),
      pass: validateField('pass', pass),
    };
    setErrors(newErrors);
    if (!newErrors.email && !newErrors.pass) {
      submitLoginSlice(email.trim(), pass, dispatch);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {
      name: validateField('name', name),
      address: validateField('address', address),
      email: validateField('email', email),
      pass: validateField('pass', pass),
      conPass: validateField('conPass', conPass),
      role: validateField('role', role),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((err) => !err)) {
      submitSignupSlice(
        name.trim(),
        address.trim(),
        email.trim(),
        pass,
        conPass,
        role,
        captchaValue,
        dispatch
      );
    }
  };

  // ✅ FIX: Keep spaces while typing, only trim for validation
  const handleChange = (field: string, value: string) => {
    const sanitized = sanitize(value);
    switch (field) {
      case 'email':
        dispatch(setEmail(sanitized));
        break;
      case 'pass':
        dispatch(setPass(sanitized));
        break;
      case 'name':
        dispatch(setName(sanitized));
        break;
      case 'address':
        dispatch(setAddress(sanitized));
        break;
      case 'conPass':
        dispatch(setConPass(sanitized));
        break;
      case 'role':
        dispatch(setRole(sanitized));
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: validateField(field, sanitized.trim()) }));
  };

  return (
    <div className={`auth-container ${isLogin ? 'login-mode' : 'signup-mode'}`}>
      <div className="auth-box">
        <div className={`form-wrapper ${isLogin ? 'show-login' : 'show-signup'}`}>

          {/* Login */}
          <div className="form-slide login-slide">
            <h2 className="auth-title">Login</h2>

            <form className="auth-form" onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                {errors.email && <p className="input-error">{errors.email}</p>}
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={pass}
                  onChange={(e) => handleChange('pass', e.target.value)}
                />
                {errors.pass && <p className="input-error">{errors.pass}</p>}
              </div>

              <button className="auth-btn" type="submit">Login</button>
            </form>

            <p className="toggle-text">
              Don&apos;t have an account?
              <span className="toggle-link" onClick={() => dispatch(setIsLogin(false))}> Sign Up</span>
            </p>
          </div>
          {/* Login */}

          {/* Signup */}
          <div className="form-slide signup-slide">
            <h2 className="auth-title">Sign Up</h2>

            <form className="auth-form" onSubmit={handleSignup}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                {errors.name && <p className="input-error">{errors.name}</p>}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  placeholder="Address"
                  required
                  value={address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
                {errors.address && <p className="input-error">{errors.address}</p>}
              </div>

              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                {errors.email && <p className="input-error">{errors.email}</p>}
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={pass}
                  onChange={(e) => handleChange('pass', e.target.value)}
                />
                {errors.pass && <p className="input-error">{errors.pass}</p>}
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  value={conPass}
                  onChange={(e) => handleChange('conPass', e.target.value)}
                />
                {errors.conPass && <p className="input-error">{errors.conPass}</p>}
              </div>

              <div className="input-group">
                <select onChange={(e) => handleChange('role', e.target.value)} value={role || ''}>
                  <option value="" disabled>Select Role</option>
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                </select>
                {errors.role && <p className="input-error">{errors.role}</p>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_SITE_KEY}
                  onChange={(token) => dispatch(setCaptchaValue(token || ''))}
                />
              </div>
              <br />

              <button className="auth-btn" type="submit">Sign Up</button>
            </form>

            <p className="toggle-text">
              Already have an account?
              <span className="toggle-link" onClick={() => dispatch(setIsLogin(true))}> Login</span>
            </p>
            {/* Signup */}
            
          </div>
        </div>
      </div>

      <div className="auth-side-panel">
        <div className="auth-side-content">
          {isLogin
            ? 'Welcome back! Please login to continue.'
            : 'Join us today! Create your free account now.'}
        </div>
      </div>
    </div>
  );
}

export default Auth;
