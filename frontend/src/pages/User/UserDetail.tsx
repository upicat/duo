import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../../components/Common/Loading';
import ConfirmModal from '../../components/Common/ConfirmModal';
import { useApi } from '../../hooks/useApi';
import './UserDetail.css';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  fullName: string;
  role: string;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  loginCount: number;
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { request } = useApi();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleEdit = () => {
    navigate(`/users/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!user) return;

    setDeleteLoading(true);
    try {
      await request(`/api/users/${user.id}`, {
        method: 'DELETE'
      });
      
      navigate('/users', { replace: true });
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/users');
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: '管理员',
      user: '普通用户',
      moderator: '版主'
    };
    return roleMap[role] || role;
  };

  const getStatusLabel = (status: string) => {
    return status === 'active' ? '激活' : '禁用';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="user-detail-loading">
        <Loading size="large" text="加载用户信息中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-detail-error">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <h2>加载失败</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={fetchUser}>
              重试
            </button>
            <button className="btn btn-secondary" onClick={handleBack}>
              返回列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-detail-error">
        <div className="error-content">
          <div className="error-icon">👤</div>
          <h2>用户不存在</h2>
          <p>未找到指定的用户信息</p>
          <button className="btn btn-primary" onClick={handleBack}>
            返回列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-detail-container">
      <div className="user-detail-header">
        <button className="back-button" onClick={handleBack}>
          <span className="back-icon">←</span>
          返回列表
        </button>
        
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleEdit}>
            <span className="btn-icon">✏️</span>
            编辑用户
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <span className="btn-icon">🗑️</span>
            删除用户
          </button>
        </div>
      </div>

      <div className="user-detail-content">
        <div className="user-profile-card">
          <div className="profile-header">
            <div className="user-avatar-large">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h1 className="user-full-name">{user.fullName}</h1>
              <p className="user-username">@{user.username}</p>
              <div className="user-badges">
                <span className={`role-badge role-${user.role}`}>
                  {getRoleLabel(user.role)}
                </span>
                <span className={`status-badge status-${user.status}`}>
                  {getStatusLabel(user.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="user-details-grid">
          <div className="detail-card">
            <h3 className="card-title">基本信息</h3>
            <div className="detail-items">
              <div className="detail-item">
                <span className="detail-label">用户ID</span>
                <span className="detail-value">{user.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">用户名</span>
                <span className="detail-value">{user.username}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">真实姓名</span>
                <span className="detail-value">{user.fullName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">角色</span>
                <span className="detail-value">
                  <span className={`role-badge role-${user.role}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">状态</span>
                <span className="detail-value">
                  <span className={`status-badge status-${user.status}`}>
                    {getStatusLabel(user.status)}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="card-title">联系信息</h3>
            <div className="detail-items">
              <div className="detail-item">
                <span className="detail-label">邮箱地址</span>
                <span className="detail-value">
                  <a href={`mailto:${user.email}`} className="email-link">
                    {user.email}
                  </a>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">手机号码</span>
                <span className="detail-value">
                  <a href={`tel:${user.phone}`} className="phone-link">
                    {user.phone}
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="card-title">账户统计</h3>
            <div className="detail-items">
              <div className="detail-item">
                <span className="detail-label">登录次数</span>
                <span className="detail-value highlight">{user.loginCount}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">最后登录</span>
                <span className="detail-value">
                  {user.lastLoginAt ? formatDate(user.lastLoginAt) : '从未登录'}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="card-title">时间信息</h3>
            <div className="detail-items">
              <div className="detail-item">
                <span className="detail-label">创建时间</span>
                <span className="detail-value">{formatDate(user.createdAt)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">更新时间</span>
                <span className="detail-value">{formatDate(user.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="确认删除用户"
        message={`确定要删除用户 "${user.fullName}" 吗？此操作不可撤销，将永久删除该用户的所有数据。`}
        type="danger"
        confirmText="确认删除"
        cancelText="取消"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default UserDetail;
