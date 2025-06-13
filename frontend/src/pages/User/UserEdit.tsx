import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from '../../components/Form/UserForm';
import Loading from '../../components/Common/Loading';
import { useApi } from '../../hooks/useApi';
import './UserEdit.css';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  fullName: string;
  role: string;
  status: 'active' | 'inactive';
}

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { request } = useApi();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const userData = await request<User>(`/api/users/${id}`);
      setUser(userData);
    } catch (err: any) {
      setError(err.message || '获取用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!user) return;

    setSubmitLoading(true);
    try {
      await request(`/api/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      navigate(`/users/${user.id}`, { replace: true });
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/users/${id}`);
  };

  if (loading) {
    return (
      <div className="user-edit-loading">
        <Loading size="large" text="加载用户信息中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-edit-error">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <h2>加载失败</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={fetchUser}>
              重试
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/users')}>
              返回列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-edit-error">
        <div className="error-content">
          <div className="error-icon">👤</div>
          <h2>用户不存在</h2>
          <p>未找到指定的用户信息</p>
          <button className="btn btn-primary" onClick={() => navigate('/users')}>
            返回列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-edit-container">
      <div className="user-edit-header">
        <button className="back-button" onClick={handleCancel}>
          <span className="back-icon">←</span>
          返回详情
        </button>
        <h1 className="page-title">编辑用户</h1>
      </div>

      <UserForm
        initialData={user}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={submitLoading}
        mode="edit"
      />
    </div>
  );
};

export default UserEdit;
