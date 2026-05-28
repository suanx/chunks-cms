export function useTable(fetchFn: (params: any) => Promise<any>) {
  const tableData = ref<any[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const pageSize = ref(20);
  const total = ref(0);

  const fetchData = async (extraParams?: any) => {
    loading.value = true;
    try {
      const data = await fetchFn({ page: page.value, pageSize: pageSize.value, ...extraParams });
      tableData.value = data?.list || [];
      total.value = data?.total || 0;
    } catch (e) { console.error(e); }
    loading.value = false;
  };

  const handlePageChange = (p: number) => { page.value = p; fetchData(); };
  const handleSizeChange = (s: number) => { pageSize.value = s; page.value = 1; fetchData(); };

  return { tableData, loading, page, pageSize, total, fetchData, handlePageChange, handleSizeChange };
}
