import React from 'react'
import { 
  Layout as AntLayout, 
  Avatar as AntAvatar, 
  Dropdown as AntDropdown, 
  Space as AntSpace, 
  Typography as AntTypography 
} from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

// 使用类型断言解决类型问题
const Layout = AntLayout as any
// Menu 未使用，所以移除
const Avatar = AntAvatar as any
const Dropdown = AntDropdown as any
const Space = AntSpace as any
const Typography = AntTypography as any

const { Header: AntHeader } = Layout
const { Text } = Typography

interface HeaderProps {
  collapsed?: boolean
  onToggle?: () => void
}

const Header: React.FC<HeaderProps> = ({ collapsed = false, onToggle }) => {
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        // 跳转到个人中心
        break
      case 'settings':
        // 跳转到设置页面
        break
      case 'logout':
        // 执行退出登录
        break
      default:
        break
    }
  }

  return (
    <AntHeader
      style={{
        padding: '0 16px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            fontSize: '18px',
            cursor: 'pointer',
            marginRight: '16px',
          }}
          onClick={onToggle}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
            Duo 管理系统
          </Text>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Space size="middle">
          <Text>欢迎回来！</Text>
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleMenuClick,
            }}
            placement="bottomRight"
            arrow
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ marginRight: 8 }}
              />
              <Text>管理员</Text>
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  )
}

export default Header
