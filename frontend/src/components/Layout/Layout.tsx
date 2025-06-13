import React, { useState } from 'react'
import { Layout as AntLayout } from 'antd'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

// 使用类型断言解决类型问题
const AntLayoutComponent = AntLayout as any
const { Content } = AntLayoutComponent

interface LayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar collapsed={collapsed} />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Header collapsed={collapsed} onToggle={toggleSidebar} />
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
              flex: 1,
            }}
          >
            {children}
          </Content>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default AppLayout
