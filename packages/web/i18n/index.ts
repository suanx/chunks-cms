import zhCn from './locales/zh-cn';
import en from './locales/en';

const messages = { 'zh-CN': zhCn, en };
const locale = ref('zh-CN');

export function useI18n() {
  const t = (key: string) => {
    const keys = key.split('.');
    let val: any = messages[locale.value];
    for (const k of keys) { val = val?.[k]; }
    return val || key;
  };
  const setLocale = (l: string) => { locale.value = l; if (process.client) localStorage.setItem('lang', l); };
  const initLocale = () => { if (process.client) { const saved = localStorage.getItem('lang'); if (saved) locale.value = saved; } };
  return { t, locale, setLocale, initLocale };
}
