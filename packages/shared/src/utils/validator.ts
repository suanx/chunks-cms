/** 校验邮箱格式 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/** 校验手机号格式（中国大陆） */
export function isValidPhone(phone: string): boolean {
  const re = /^1[3-9]\d{9}$/;
  return re.test(phone);
}

/** 校验用户名格式（4-20位字母数字下划线） */
export function isValidUsername(username: string): boolean {
  const re = /^[a-zA-Z0-9_]{4,20}$/;
  return re.test(username);
}

/** 校验密码强度（至少6位，包含字母和数字） */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/** 校验 URL 格式 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
