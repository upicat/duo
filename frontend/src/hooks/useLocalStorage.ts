import { useState, useEffect } from 'react';

type SetValue<T> = T | ((val: T) => T);

/**
 * 本地存储Hook
 * @param key 存储键名
 * @param initialValue 初始值
 * @returns [storedValue, setValue]
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: SetValue<T>) => void] {
    // 获取localStorage中的值
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            if (!item) {
                return initialValue;
            }

            // 尝试解析为JSON
            try {
                return JSON.parse(item);
            } catch (parseError) {
                // 如果JSON解析失败，说明存储的数据格式不兼容
                // 清除无效数据并返回初始值
                console.warn(`localStorage key "${key}" contains invalid JSON data, clearing and using initial value:`, item);
                window.localStorage.removeItem(key);
                return initialValue;
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // 设置值到localStorage和state
    const setValue = (value: SetValue<T>) => {
        try {
            // 允许value是一个函数，用于更新基于先前值的状态
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            // 保存到localStorage
            if (typeof window !== 'undefined') {
                if (valueToStore === null || valueToStore === undefined) {
                    window.localStorage.removeItem(key);
                } else {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}

/**
 * 会话存储Hook
 * @param key 存储键名
 * @param initialValue 初始值
 * @returns [storedValue, setValue]
 */
export function useSessionStorage<T>(
    key: string,
    initialValue: T
): [T, (value: SetValue<T>) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.sessionStorage.getItem(key);
            if (!item) {
                return initialValue;
            }

            // 尝试解析为JSON
            try {
                return JSON.parse(item);
            } catch (parseError) {
                // 如果JSON解析失败，检查是否是字符串类型的初始值
                // 如果是，则直接返回原始字符串值
                if (typeof initialValue === 'string' || initialValue === null) {
                    //console.warn(`sessionStorage key "${key}" contains non-JSON data, treating as string:`, item);
                    return item as T;
                }
                // 如果初始值不是字符串类型，则抛出原始错误
                throw parseError;
            }
        } catch (error) {
            console.error(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value: SetValue<T>) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            if (typeof window !== 'undefined') {
                if (valueToStore === null || valueToStore === undefined) {
                    window.sessionStorage.removeItem(key);
                } else {
                    window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
                }
            }
        } catch (error) {
            console.error(`Error setting sessionStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}

/**
 * 存储事件监听Hook
 * 监听其他标签页或窗口对localStorage的更改
 */
export function useStorageListener(
    key: string,
    callback: (newValue: string | null, oldValue: string | null) => void
) {
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.storageArea === localStorage) {
                callback(e.newValue, e.oldValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, callback]);
}

/**
 * 清除存储Hook
 * 提供清除localStorage和sessionStorage的方法
 */
export function useClearStorage() {
    const clearLocalStorage = (keys?: string[]) => {
        if (typeof window === 'undefined') return;

        if (keys && keys.length > 0) {
            keys.forEach(key => {
                window.localStorage.removeItem(key);
            });
        } else {
            window.localStorage.clear();
        }
    };

    const clearSessionStorage = (keys?: string[]) => {
        if (typeof window === 'undefined') return;

        if (keys && keys.length > 0) {
            keys.forEach(key => {
                window.sessionStorage.removeItem(key);
            });
        } else {
            window.sessionStorage.clear();
        }
    };

    const clearAllStorage = () => {
        clearLocalStorage();
        clearSessionStorage();
    };

    return {
        clearLocalStorage,
        clearSessionStorage,
        clearAllStorage
    };
}

/**
 * 存储容量检查Hook
 */
export function useStorageCapacity() {
    const getStorageSize = (storage: Storage): number => {
        let total = 0;
        for (const key in storage) {
            if (storage.hasOwnProperty(key)) {
                total += storage[key].length + key.length;
            }
        }
        return total;
    };

    const getLocalStorageSize = (): number => {
        if (typeof window === 'undefined') return 0;
        return getStorageSize(window.localStorage);
    };

    const getSessionStorageSize = (): number => {
        if (typeof window === 'undefined') return 0;
        return getStorageSize(window.sessionStorage);
    };

    const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
        if (typeof window === 'undefined') return false;

        try {
            const storage = window[type];
            const testKey = '__storage_test__';
            storage.setItem(testKey, 'test');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    };

    return {
        getLocalStorageSize,
        getSessionStorageSize,
        isStorageAvailable
    };
}

/**
 * 带过期时间的localStorage Hook
 */
export function useLocalStorageWithExpiry<T>(
    key: string,
    initialValue: T,
    expiryInMinutes?: number
): [T, (value: SetValue<T>) => void, () => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            if (!item) {
                return initialValue;
            }

            const parsedItem = JSON.parse(item);

            // 检查是否有过期时间设置
            if (parsedItem.expiry && new Date().getTime() > parsedItem.expiry) {
                window.localStorage.removeItem(key);
                return initialValue;
            }

            return parsedItem.value !== undefined ? parsedItem.value : parsedItem;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value: SetValue<T>) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            if (typeof window !== 'undefined') {
                if (valueToStore === null || valueToStore === undefined) {
                    window.localStorage.removeItem(key);
                } else {
                    const itemToStore = expiryInMinutes
                        ? {
                            value: valueToStore,
                            expiry: new Date().getTime() + expiryInMinutes * 60 * 1000
                        }
                        : valueToStore;

                    window.localStorage.setItem(key, JSON.stringify(itemToStore));
                }
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    const removeValue = () => {
        setStoredValue(initialValue);
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key);
        }
    };

    return [storedValue, setValue, removeValue];
}
