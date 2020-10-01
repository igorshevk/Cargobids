import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const configuration = {
    autoClose: 3000,
    position: "top-right",
    hideProgressBar:false,
    closeOnClick:false,
    newestOnTop:true,
    rtl:false
};

export default {

    warning(message) {
        toast.configure(configuration);
        toast(message, { type: toast.TYPE.WARNING });
    },
    error(message) {
        toast.configure(configuration);
        toast(message, { type: toast.TYPE.ERROR });
    },
    info(message) {
        toast.configure(configuration);
        toast(message, { type: toast.TYPE.INFO });
    },
    default(message) {
        toast.configure(configuration);
        toast(message, { type: toast.TYPE.DEFAULT });
    },
    success(message) {
        toast.configure(configuration);
        toast(message, { type: toast.TYPE.SUCCESS });
    }
}



