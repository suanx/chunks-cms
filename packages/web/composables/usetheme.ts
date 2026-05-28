export const useTheme = () => {
  const isDark = useState<boolean>('theme-dark', () => false);

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    applyTheme();
    if (process.client) localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  };

  const applyTheme = () => {
    if (process.client) {
      document.documentElement.classList.toggle('dark', isDark.value);
      document.documentElement.classList.toggle('light', !isDark.value);
    }
  };

  const initTheme = () => {
    if (process.client) {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true;
      }
      applyTheme();
    }
  };

  return { isDark, toggleTheme, initTheme };
};
