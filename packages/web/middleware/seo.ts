export default defineNuxtRouteMiddleware((to) => {
  const title = (to.meta.title as string) || '淳渔 CMS';
  useHead({ title: `${title} - 淳渔 CMS` });
});
