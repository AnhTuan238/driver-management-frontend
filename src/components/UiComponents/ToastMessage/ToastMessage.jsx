import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { CloseIcon, WarningIcon } from '~/components/UiComponents/Icon';

export default function Toast({ title, message, type = '', onClose }) {
    const borderColor = {
        success: '#47d864',
        warning: '#ffc021',
        failure: 'oklch(0.637 0.237 25.331)',
    };
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={'toast flex items-center gap-4 p-4 max-w-sm w-full z-50 bg-white border-l-4 shadow-lg'}
            style={{ borderLeftColor: borderColor[type] }}
        >
            <WarningIcon className='p-1 size-3! bg-warning text-white rounded-full border border-warning' />

            <div className='flex-1'>
                <h3 className='text-[15px] font-bold text-black'>{t(title)}</h3>
                <p className='text-sm text-gray-400 mt-1'>{t(message)}</p>
            </div>
            <button onClick={onClose} className='ml-4 cursor-pointer text-gray-400 hover:text-gray-700'>
                <CloseIcon className='size-6' />
            </button>
        </div>
    );
}
