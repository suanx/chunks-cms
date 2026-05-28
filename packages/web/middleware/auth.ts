export default defineNuxtRouteMiddleware((to) => {
  // SSR 端也检查，防止服务端渲染出需要鉴权的页面内容
  if (process.server) {
    const token = useCookie('token');
    if (!token.value && to.path.startsWith('/user')) {
      return navigateTo('/');
    }
    return;
  }

  // 客户端检查
  const token = localStorage.getItem('token');
  const publicPages = ['/', '/video', '/movie', '/search', '/login'];
  const isPublic = publicPages.some(p =>
    to.path === p || to.path.startsWith('/video/') || to.path.startsWith('/movie/'),
  );

  if (!token && !isPublic && to.path.startsWith('/user')) {
    return navigateTo('/');
  }
});
