export const usePagination = () => {
  const page = ref(1);
  const pageSize = ref(20);
  const total = ref(0);

  const setPage = (p: number) => { page.value = p; };
  const setPageSize = (s: number) => { pageSize.value = s; page.value = 1; };
  const setTotal = (t: number) => { total.value = t; };

  return { page, pageSize, total, setPage, setPageSize, setTotal };
};
