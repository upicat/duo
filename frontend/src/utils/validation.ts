/**
 * 表单验证工具类
 * 提供常用的表单字段验证方法
 */

// 验证结果接口
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// 验证规则接口
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => ValidationResult;
}

/**
 * 邮箱验证
 * @param email 邮箱地址
 * @returns 验证结果
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: '邮箱地址不能为空' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '请输入有效的邮箱地址' };
  }
  
  return { isValid: true };
};

/**
 * 密码验证
 * @param password 密码
 * @param minLength 最小长度，默认6位
 * @returns 验证结果
 */
export const validatePassword = (password: string, minLength: number = 6): ValidationResult => {
  if (!password) {
    return { isValid: false, message: '密码不能为空' };
  }
  
  if (password.length < minLength) {
    return { isValid: false, message: `密码长度不能少于${minLength}位` };
  }
  
  // 检查是否包含数字和字母
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  
  if (!hasNumber || !hasLetter) {
    return { isValid: false, message: '密码必须包含数字和字母' };
  }
  
  return { isValid: true };
};

/**
 * 手机号验证
 * @param phone 手机号
 * @returns 验证结果
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: '手机号不能为空' };
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: '请输入有效的手机号' };
  }
  
  return { isValid: true };
};

/**
 * 用户名验证
 * @param username 用户名
 * @returns 验证结果
 */
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, message: '用户名不能为空' };
  }
  
  if (username.length < 3 || username.length > 20) {
    return { isValid: false, message: '用户名长度应在3-20个字符之间' };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: '用户名只能包含字母、数字、下划线和中文' };
  }
  
  return { isValid: true };
};

/**
 * 必填字段验证
 * @param value 字段值
 * @param fieldName 字段名称
 * @returns 验证结果
 */
export const validateRequired = (value: any, fieldName: string = '此字段'): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName}不能为空` };
  }
  
  return { isValid: true };
};

/**
 * 长度验证
 * @param value 字段值
 * @param minLength 最小长度
 * @param maxLength 最大长度
 * @param fieldName 字段名称
 * @returns 验证结果
 */
export const validateLength = (
  value: string, 
  minLength: number, 
  maxLength: number, 
  fieldName: string = '此字段'
): ValidationResult => {
  if (!value) {
    return { isValid: false, message: `${fieldName}不能为空` };
  }
  
  if (value.length < minLength) {
    return { isValid: false, message: `${fieldName}长度不能少于${minLength}个字符` };
  }
  
  if (value.length > maxLength) {
    return { isValid: false, message: `${fieldName}长度不能超过${maxLength}个字符` };
  }
  
  return { isValid: true };
};

/**
 * 数字验证
 * @param value 数值
 * @param min 最小值
 * @param max 最大值
 * @param fieldName 字段名称
 * @returns 验证结果
 */
export const validateNumber = (
  value: number, 
  min?: number, 
  max?: number, 
  fieldName: string = '此字段'
): ValidationResult => {
  if (isNaN(value)) {
    return { isValid: false, message: `${fieldName}必须是数字` };
  }
  
  if (min !== undefined && value < min) {
    return { isValid: false, message: `${fieldName}不能小于${min}` };
  }
  
  if (max !== undefined && value > max) {
    return { isValid: false, message: `${fieldName}不能大于${max}` };
  }
  
  return { isValid: true };
};

/**
 * 身份证号验证
 * @param idCard 身份证号
 * @returns 验证结果
 */
export const validateIdCard = (idCard: string): ValidationResult => {
  if (!idCard) {
    return { isValid: false, message: '身份证号不能为空' };
  }
  
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!idCardRegex.test(idCard)) {
    return { isValid: false, message: '请输入有效的身份证号' };
  }
  
  return { isValid: true };
};

/**
 * URL验证
 * @param url URL地址
 * @returns 验证结果
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, message: 'URL不能为空' };
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: '请输入有效的URL地址' };
  }
};

/**
 * 确认密码验证
 * @param password 原密码
 * @param confirmPassword 确认密码
 * @returns 验证结果
 */
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: '确认密码不能为空' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: '两次输入的密码不一致' };
  }
  
  return { isValid: true };
};

/**
 * 通用字段验证器
 * @param value 字段值
 * @param rules 验证规则
 * @param fieldName 字段名称
 * @returns 验证结果
 */
export const validateField = (value: any, rules: ValidationRule, fieldName: string = '此字段'): ValidationResult => {
  // 必填验证
  if (rules.required) {
    const requiredResult = validateRequired(value, fieldName);
    if (!requiredResult.isValid) {
      return requiredResult;
    }
  }
  
  // 如果不是必填且值为空，则跳过其他验证
  if (!rules.required && (!value || value === '')) {
    return { isValid: true };
  }
  
  // 长度验证
  if (rules.minLength !== undefined || rules.maxLength !== undefined) {
    const minLength = rules.minLength || 0;
    const maxLength = rules.maxLength || Infinity;
    const lengthResult = validateLength(value, minLength, maxLength, fieldName);
    if (!lengthResult.isValid) {
      return lengthResult;
    }
  }
  
  // 正则表达式验证
  if (rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, message: `${fieldName}格式不正确` };
  }
  
  // 自定义验证
  if (rules.custom) {
    const customResult = rules.custom(value);
    if (!customResult.isValid) {
      return customResult;
    }
  }
  
  return { isValid: true };
};

/**
 * 表单验证器
 * @param formData 表单数据
 * @param validationRules 验证规则映射
 * @returns 验证结果映射
 */
export const validateForm = (
  formData: Record<string, any>, 
  validationRules: Record<string, ValidationRule>
): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};
  
  Object.keys(validationRules).forEach(fieldName => {
    const value = formData[fieldName];
    const rules = validationRules[fieldName];
    results[fieldName] = validateField(value, rules, fieldName);
  });
  
  return results;
};

/**
 * 检查表单是否全部通过验证
 * @param validationResults 验证结果映射
 * @returns 是否全部通过验证
 */
export const isFormValid = (validationResults: Record<string, ValidationResult>): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};

/**
 * 获取第一个验证错误信息
 * @param validationResults 验证结果映射
 * @returns 第一个错误信息
 */
export const getFirstErrorMessage = (validationResults: Record<string, ValidationResult>): string | null => {
  for (const result of Object.values(validationResults)) {
    if (!result.isValid && result.message) {
      return result.message;
    }
  }
  return null;
};

// 常用验证规则预设
export const commonRules = {
  email: { required: true, custom: (value: string) => validateEmail(value) },
  password: { required: true, custom: (value: string) => validatePassword(value) },
  phone: { required: true, custom: (value: string) => validatePhone(value) },
  username: { required: true, custom: (value: string) => validateUsername(value) },
  required: { required: true },
  optional: { required: false }
};
