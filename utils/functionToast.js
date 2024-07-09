import toastr from "toastr"
import "../node_modules/toastr/build/toastr.css"

export const showToast = (text, type) => {
    toastr.options.closeDuration = 500;
    toastr.options.closeButton = true;
    toastr.options.progressBar = true;
    if (type === 'success') {
        toastr.success(text);
    } else if (type === 'error') {
        toastr.error(text);
    } else if (type === 'info') {
      toastr.info(text);
    }
}