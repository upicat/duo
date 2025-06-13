import React, { useState, useEffect } from 'react';
import { 
  validateUsername, 
  validateEmail, 
  validatePhone, 
  validateRequired,
  ValidationResult 
} from '../../utils/validation';
import Loading from '../Common/Loading';
import './UserForm.css';

interface UserFormData {
  id?: number;
  username: string;
  email: string;
  phone: string;
  fullName: string;
  role: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  mode
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    phone: '',
    fullName: '',
    role: 'user',
    status: 'active',
    ...initialData
  });

  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});

  const [touched, setTouched] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 实时验证
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      case 'username':
        result = validateUsername(value);
        break;
      case 'email':
        result = validateEmail(value);
        break;
      case 'phone':
        result = validatePhone(value);
        break;
      case 'fullName':
        result = validateRequired(value, '姓名');
        break;
      case 'role':
        result = validateRequired(value, '角色');
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: result.isValid ? '' : result.message || ''
    }));

    return result;
  };

  const validateForm = (): boolean => {
    const fields = ['username', 'email', 'phone', 'fullName', 'role'];
    let isValid = true;

    fields.forEach(field => {
      const result = validateField(field, formData[field as keyof UserFormData]);
      if (!result.isValid) {
        isValid = false;
      }
    });

    setTouched(
      fields.reduce((acc, field) => ({
        ...acc,
        [field]: true
      }), {})
    );

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('User form submission error:', err);
    }
  };

  const roleOptions = [
    { value: 'admin', label: '管理员' },
    { value: 'user', label: '普通用户' },
    { value: 'moderator', label: '版主' }
  ];

  return (
    <div className="user-form-container">
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2 className="form-title">
            {mode === 'create' ? '创建用户' : '编辑用户'}
          </h2>
          <p className="form-subtitle">
            {mode === 'create' ? '请填写用户信息' : '修改用户信息'}
          </p>
        </div>

        <div className="form-body">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                用户名 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="请输入用户名"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                autoComplete="username"
              />
              {errors.username && (
                <div className="field-error">{errors.username}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                姓名 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className={`form-input ${errors.fullName ? 'error' : ''}`}
                placeholder="请输入真实姓名"
                value={formData.fullName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                autoComplete="name"
              />
              {errors.fullName && (
                <div className="field-error">{errors.fullName}</div>
              )}
            </div>
          </div>

          <div className="form-row">
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
              <label htmlFor="phone" className="form-label">
                手机号 <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="请输入手机号"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                autoComplete="tel"
              />
              {errors.phone && (
                <div className="field-error">{errors.phone}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role" className="form-label">
                角色 <span className="required">*</span>
              </label>
              <select
                id="role"
                name="role"
                className={`form-select ${errors.role ? 'error' : ''}`}
                value={formData.role}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <div className="field-error">{errors.role}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                状态
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="active">激活</option>
                <option value="inactive">禁用</option>
              </select>
            </div>
          </div>

          {mode === 'edit' && formData.id && (
            <div className="form-group">
              <label className="form-label">用户ID</label>
              <input
                type="text"
                className="form-input"
                value={formData.id}
                disabled
                readOnly
              />
            </div>
          )}
        </div>

        <div className="form-footer">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            取消
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loading size="small" text="" />
                {mode === 'create' ? '创建中...' : '保存中...'}
              </>
            ) : (
              mode === 'create' ? '创建用户' : '保存修改'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
