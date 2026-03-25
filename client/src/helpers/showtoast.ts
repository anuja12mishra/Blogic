import { toast, Slide, ToastOptions } from "react-toastify";

type ToastType = 'success' | 'info' | 'error' | 'warning' | 'default';

export const showtoast = (type: ToastType, message: string) => {
    const config: ToastOptions = {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Slide,
    }
    
    if (type === 'success') {
        toast.success(message, config);
    }
    else if (type === 'info') {
        toast.info(message, config);
    } 
    else if (type === 'error') {
        toast.error(message, config);
    } 
    else if (type === 'warning') {
        toast.warning(message, config);
    }
    else {
        toast(message, config);
    }
}
