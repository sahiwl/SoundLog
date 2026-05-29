import { toast, type ToastOptions, type ToastPosition } from "react-toastify";

const toastConfig: ToastOptions = {
  position: "bottom-right" as ToastPosition,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  style: { marginTop: "-100px" },
};

export interface ShowToast {
  success: (message: string) => void;
  error: (message: string) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
}

export const showToast: ShowToast = {
  success: (message: string) => toast.success(message, toastConfig),
  error: (message: string) => toast.error(message, toastConfig),
  warn: (message: string) => toast.warn(message, toastConfig),
  info: (message: string) => toast.info(message, toastConfig),
};

export default toastConfig;