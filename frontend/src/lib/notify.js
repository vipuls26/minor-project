import { toast } from 'vue-sonner'

const toastByType = {
  success: toast.success,
  error: toast.error,
  info: toast.info,
  warning: toast.warning,
  loading: toast.loading,
}

export function notify(type = 'success', message, options = {}) {
  const showToast = toastByType[type] || toast.message

  return showToast(message, options)
}
