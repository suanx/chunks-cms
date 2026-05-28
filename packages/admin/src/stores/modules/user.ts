import { defineStore } from 'pinia';

interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  roles: string[];
}

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('admin_token') || '');
  const userInfo = ref<UserInfo | null>(null);
  const isLoggedIn = computed(() => !!token.value);

  function setToken(t: string) {
    token.value = t;
    localStorage.setItem('admin_token', t);
  }

  function setUserInfo(info: UserInfo) {
    userInfo.value = info;
  }

  function logout() {
    token.value = '';
    userInfo.value = null;
    localStorage.removeItem('admin_token');
  }

  return { token, userInfo, isLoggedIn, setToken, setUserInfo, logout };
});
