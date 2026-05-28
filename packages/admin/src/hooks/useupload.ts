export function useUpload() {
  const uploading = ref(false);
  const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/upload`;
  const headers = computed(() => ({
    Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  }));
  return { uploading, uploadUrl, headers };
}
