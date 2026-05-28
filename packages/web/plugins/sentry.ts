export default defineNuxtPlugin(async () => {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    // 动态导入避免开发环境加载
    const Sentry = await import('@sentry/nuxt');
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
    });
  }
});
