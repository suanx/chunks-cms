export const rules = {
  required: (msg: string) => [{ required: true, message: msg, trigger: 'blur' }],
  email: [{ type: 'email' as const, message: '请输入正确的邮箱', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
};
