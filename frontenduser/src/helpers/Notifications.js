import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure({ allowHtml: true});

export function successNoti(message) {
    toast(message, { type: toast.TYPE.SUCCESS });
}


export function warningNoti(message) {
    toast(message, { type: toast.TYPE.WARNING});
}

export function errorNoti(message, autoClose=true) {
    toast(message, { type: toast.TYPE.ERROR, autoClose:autoClose });
}

export function infoNoti(message) {
    toast(message, { type: toast.TYPE.INFO });
}

export function defaultNoti(message) {
    toast(message, { type: toast.TYPE.DEFAULT });
}