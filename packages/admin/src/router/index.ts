import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { setupRouterGuard } from './guard';

const router = createRouter({
  history: createWebHistory('/admin'),
  routes,
});

setupRouterGuard(router);

export default router;
