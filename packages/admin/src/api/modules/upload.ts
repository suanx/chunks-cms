import api from '../index';

export const uploadFile = (file: File, type: string) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/upload?type=${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
