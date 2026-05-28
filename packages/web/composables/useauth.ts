export const useAuth = () => {
  const user = useState<any>('auth-user', () => null);
  const isLoggedIn = computed(() => !!user.value);

  const login = async (username: string, password: string) => {
    const { api } = useApi();
    const data = await api.post('/auth/login', { username, password });
    if (process.client) {
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    user.value = data.user;
    return data;
  };

  const logout = () => {
    user.value = null;
    if (process.client) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    navigateTo('/');
  };

  const fetchProfile = async () => {
    try {
      const { api } = useApi();
      user.value = await api.get('/users/profile');
    } catch (error) { console.error('[Auth] 获取用户信息失败:', error); logout(); }
  };

  return { user, isLoggedIn, login, logout, fetchProfile };
};
