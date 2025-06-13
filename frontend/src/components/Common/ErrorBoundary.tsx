import { Component, ErrorInfo, ReactNode } from 'react'
import { Result as AntResult, Button as AntButton } from 'antd'

// 使用类型断言解决类型问题
const Result = AntResult as any
const Button = AntButton as any

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="页面出现错误"
          subTitle="抱歉，页面出现了意外错误。请尝试刷新页面或返回首页。"
          extra={[
            <Button type="primary" key="reload" onClick={this.handleReload}>
              刷新页面
            </Button>,
            <Button key="home" onClick={this.handleGoHome}>
              返回首页
            </Button>,
          ]}
        >
          {import.meta.env.DEV && (
            <div style={{ textAlign: 'left', marginTop: 24 }}>
              <details style={{ whiteSpace: 'pre-wrap' }}>
                <summary>错误详情（开发环境）</summary>
                <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
                  <strong>错误信息：</strong>
                  <br />
                  {this.state.error && this.state.error.toString()}
                  <br />
                  <br />
                  <strong>错误堆栈：</strong>
                  <br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </div>
              </details>
            </div>
          )}
        </Result>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
