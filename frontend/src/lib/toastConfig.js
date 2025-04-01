import { toast } from "react-toastify";

const toastConfig = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
      // Ensure proper stacking behavior
      newestOnTop: false,
      // Optional: Add some spacing between stacked toasts
      style: { marginTop: '-100px' }
}

export const showToast = {
success: (message) => toast.success(message, toastConfig),
  error: (message) => toast.error(message, toastConfig),
  warn: (message) => toast.warn(message, toastConfig),
  info: (message) => toast.info(message, toastConfig),
};

export default toastConfig