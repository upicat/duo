import React, { useState } from 'react';
import { validateEmail, validatePassword, ValidationResult } from '../../utils/validation';
import Loading from '../Common/Loading';
import './LoginForm.css';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  error
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [touched, setTouched] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // 实时验证
    if (touched[name as keyof typeof touched]) {
      validateField(name, newValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const validateField = (fieldName: string, value: any): ValidationResult => {
    let result: ValidationResult = { isValid: true };

    switch (fieldName) {
      case 'email':
        result = validateEmail(value);
        break;
      case 'password':
        result = validatePassword(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: result.isValid ? undefined : result.message
    }));

    return result;
  };

  const validateForm = (): boolean => {
    const emailResult = validateField('email', formData.email);
    const passwordResult = validateField('password', formData.password);

    setTouched({
      email: true,
      password: true
    });

    return emailResult.isValid && passwordResult.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      // 错误处理由父组件处理
      console.error('Login form submission error:', err);
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2 className="form-title">登录</h2>
          <p className="form-subtitle">欢迎回来，请登录您的账户</p>
        </div>

        {error && (
          <div className="form-error">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            邮箱地址 <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="请输入邮箱地址"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={loading}
            autoComplete="email"
          />
          {errors.email && (
            <div className="field-error">{errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            密码 <span className="required">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="请输入密码"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={loading}
            autoComplete="current-password"
          />
          {errors.password && (
            <div className="field-error">{errors.password}</div>
          )}
        </div>

        <div className="form-group form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={loading}
            />
            <span className="checkbox-custom"></span>
            记住我
          </label>
          
          <a href="/forgot-password" className="forgot-password-link">
            忘记密码？
          </a>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={loading || !formData.email || !formData.password}
        >
          {loading ? (
            <>
              <Loading size="small" text="" />
              登录中...
            </>
          ) : (
            '登录'
          )}
        </button>

        <div className="form-footer">
          <p>
            还没有账户？
            <a href="/register" className="register-link">立即注册</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
