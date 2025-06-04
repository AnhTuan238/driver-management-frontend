import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '~/redux/toastSlice';
import ToastMessage from './ToastMessage';

const ToastContainer = () => {
    const toasts = useSelector((state) => state.toast);
    const dispatch = useDispatch();

    return (
        <div className='fixed top-16 right-10 z-50 flex flex-col gap-2'>
            {[...toasts].reverse().map((toast) => (
                <ToastMessage key={toast.id} {...toast} onClose={() => dispatch(removeToast(toast.id))} />
            ))}
        </div>
    );
};

export default ToastContainer;
