import React from 'react'
import { Layout as AntLayout, Menu as AntMenu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

// 使用类型断言解决类型问题
const Layout = AntLayout as any
const Menu = AntMenu as any

const { Sider } = Layout

interface SidebarProps {
  collapsed?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
      children: [
        {
          key: '/users',
          label: '用户列表',
        },
        {
          key: '/users/create',
          label: '新增用户',
        },
      ],
    },
    {
      key: '/roles',
      icon: <TeamOutlined />,
      label: '角色管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      key: '/about',
      icon: <InfoCircleOutlined />,
      label: '关于系统',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const pathname = location.pathname
    return [pathname]
  }

  // 获取当前展开的菜单项
  const getOpenKeys = () => {
    const pathname = location.pathname
    const openKeys: string[] = []
    
    if (pathname.startsWith('/users')) {
      openKeys.push('/users')
    }
    
    return openKeys
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          height: '100%',
          borderRight: 0,
        }}
      />
    </Sider>
  )
}

export default Sidebar
