import type { Router } from 'vue-router';

export function setupRouterGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    document.title = `${(to.meta as any).title || '管理后台'} - 淳渔 CMS`;
    const token = localStorage.getItem('admin_token');
    if (to.path !== '/login' && !token) {
      next('/login');
    } else {
      next();
    }
  });
}
