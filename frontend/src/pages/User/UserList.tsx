import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Common/Loading';
import ConfirmModal from '../../components/Common/ConfirmModal';
import { useApi } from '../../hooks/useApi';
import './UserList.css';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  fullName: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const { request } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await request<UserListResponse>(`/api/users?${params}`);
      setUsers(response.users);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
    setCurrentPage(1);
  };

  const handleEdit = (user: User) => {
    navigate(`/users/${user.id}/edit`);
  };

  const handleView = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    setDeleteLoading(true);
    try {
      await request(`/api/users/${selectedUser.id}`, {
        method: 'DELETE'
      });
      
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setTotal(total - 1);
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateUser = () => {
    navigate('/users/create');
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
      minute: '2-digit'
    });
  };

  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return (
      <div className="user-list-loading">
        <Loading size="large" text="加载用户列表中..." />
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <div className="header-left">
          <h1 className="page-title">用户管理</h1>
          <p className="page-subtitle">管理系统用户账户</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateUser}>
          <span className="btn-icon">➕</span>
          创建用户
        </button>
      </div>

      <div className="user-list-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索用户名、邮箱或姓名..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className="status-filter"
        >
          <option value="all">全部状态</option>
          <option value="active">激活</option>
          <option value="inactive">禁用</option>
        </select>
      </div>

      <div className="user-list-stats">
        <div className="stat-item">
          <span className="stat-number">{total}</span>
          <span className="stat-label">总用户数</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{users.filter(u => u.status === 'active').length}</span>
          <span className="stat-label">激活用户</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{users.filter(u => u.status === 'inactive').length}</span>
          <span className="stat-label">禁用用户</span>
        </div>
      </div>

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>用户信息</th>
              <th>联系方式</th>
              <th>角色</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="user-row">
                <td className="user-info">
                  <div className="user-avatar">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{user.fullName}</div>
                    <div className="username">@{user.username}</div>
                  </div>
                </td>
                <td className="contact-info">
                  <div className="email">{user.email}</div>
                  <div className="phone">{user.phone}</div>
                </td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${user.status}`}>
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td className="date-cell">
                  {formatDate(user.createdAt)}
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      className="btn-action btn-view"
                      onClick={() => handleView(user)}
                      title="查看详情"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleEdit(user)}
                      title="编辑用户"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(user)}
                      title="删除用户"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>暂无用户数据</h3>
            <p>没有找到符合条件的用户</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            上一页
          </button>
          
          <div className="pagination-info">
            第 {currentPage} 页，共 {totalPages} 页
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            下一页
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="确认删除"
        message={`确定要删除用户 "${selectedUser?.fullName}" 吗？此操作不可撤销。`}
        type="danger"
        confirmText="删除"
        cancelText="取消"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default UserList;
