import { Bounce, toast } from "react-toastify";

export const Notify = (text, type, autoClose=1000, theme="light") => {
    let obj = {
        position: "top-right",
        autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme,
        transition: Bounce,
    }
    switch (type) {
        case "info":
            toast.info(text, obj);
            break;
        case "success":
            toast.success(text, obj);
            break;
        case "error":
            toast.error(text, obj);
            break;
        case "warning":
            toast.warning(text, obj);
            break;
        default:
            toast(text, obj)
            break;
    }
}