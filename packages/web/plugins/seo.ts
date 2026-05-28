export default defineNuxtPlugin(() => {
  const route = useRoute();
  watch(() => route.fullPath, (path) => {
    const title = (route.meta?.title as string) || '首页';
    useHead({
      title: `${title} - 淳渔 CMS`,
      meta: [
        { name: 'description', content: `淳渔 CMS - ${title}` },
        { property: 'og:title', content: `${title} - 淳渔 CMS` },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '淳渔 CMS' },
      ],
      link: [
        { rel: 'canonical', href: `https://chunyu-cms.com${path}` },
      ],
    });
  }, { immediate: true });
});
