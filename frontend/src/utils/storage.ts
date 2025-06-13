/**
 * 本地存储工具类
 */
class Storage {
  /**
   * 设置存储项
   */
  set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error('Error setting localStorage item:', error)
    }
  }

  /**
   * 获取存储项
   */
  get<T = any>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      if (item === null) {
        return null
      }
      return JSON.parse(item) as T
    } catch (error) {
      console.error('Error getting localStorage item:', error)
      return null
    }
  }

  /**
   * 移除存储项
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing localStorage item:', error)
    }
  }

  /**
   * 清空所有存储项
   */
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  /**
   * 检查是否存在某个键
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null
  }

  /**
   * 获取所有键
   */
  keys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        keys.push(key)
      }
    }
    return keys
  }

  /**
   * 获取存储大小（字节）
   */
  size(): number {
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key) || ''
        total += value.length + key.length
      }
    }
    return total
  }
}

/**
 * 会话存储工具类
 */
class SessionStorageClass {
  /**
   * 设置存储项
   */
  set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value)
      window.sessionStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error('Error setting sessionStorage item:', error)
    }
  }

  /**
   * 获取存储项
   */
  get<T = any>(key: string): T | null {
    try {
      const item = window.sessionStorage.getItem(key)
      if (item === null) {
        return null
      }
      return JSON.parse(item) as T
    } catch (error) {
      console.error('Error getting sessionStorage item:', error)
      return null
    }
  }

  /**
   * 移除存储项
   */
  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing sessionStorage item:', error)
    }
  }

  /**
   * 清空所有存储项
   */
  clear(): void {
    try {
      window.sessionStorage.clear()
    } catch (error) {
      console.error('Error clearing sessionStorage:', error)
    }
  }

  /**
   * 检查是否存在某个键
   */
  has(key: string): boolean {
    return window.sessionStorage.getItem(key) !== null
  }
}

// 导出实例
export const storage = new Storage()
export const sessionStorage = new SessionStorageClass()

// 默认导出本地存储
export default storage
