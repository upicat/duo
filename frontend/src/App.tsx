// React 在 JSX 中隐式使用
import { Routes, Route } from 'react-router-dom'
import AuthProvider from './components/Auth/AuthProvider'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import AppLayout from './components/Layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import UserList from './pages/User/UserList'
import UserDetail from './pages/User/UserDetail'
import UserEdit from './pages/User/UserEdit'
import './App.css'

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          {/* 登录页面 - 不需要认证 */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } 
          />
          
          {/* 需要认证的页面 */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Home />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <About />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <UserList />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/:id" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <UserDetail />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/:id/edit" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <UserEdit />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
