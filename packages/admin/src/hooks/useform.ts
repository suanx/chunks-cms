export function useForm<T>(defaultValues: T) {
  const form = reactive({ ...defaultValues } as T);
  const resetForm = () => Object.assign(form, defaultValues);
  return { form, resetForm };
}
