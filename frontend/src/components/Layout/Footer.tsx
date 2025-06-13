import React from 'react'
import { Layout, Typography } from 'antd'
import { APP_INFO } from '@/utils/constants'

const { Footer: AntFooter } = Layout
const { Text, Link } = Typography

const Footer: React.FC = () => {
  return (
    <AntFooter
      style={{
        textAlign: 'center',
        background: '#f0f2f5',
        borderTop: '1px solid #e8e8e8',
        padding: '24px 50px',
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <Text type="secondary">
          {APP_INFO.COPYRIGHT}
        </Text>
      </div>
      <div>
        <Text type="secondary">
          {APP_INFO.NAME} v{APP_INFO.VERSION} - {APP_INFO.DESCRIPTION}
        </Text>
      </div>
      <div style={{ marginTop: '8px' }}>
        <Text type="secondary">
          技术支持：
          <Link href="https://github.com" target="_blank" style={{ marginLeft: '4px' }}>
            GitHub
          </Link>
          {' | '}
          <Link href="mailto:support@example.com" style={{ marginLeft: '4px' }}>
            联系我们
          </Link>
        </Text>
      </div>
    </AntFooter>
  )
}

export default Footer
