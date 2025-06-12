import { toast, Bounce } from "react-toastify"

export const showtoast = (type, message) => {
    const config = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
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