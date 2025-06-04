import { useTranslation } from 'react-i18next';

function SearchInput({ children = null, onClick = () => {} }) {
    const { t } = useTranslation();

    return (
        <>
            <button
                className='hidden items-center ps-4 pe-1 py-1 h-[40px] w-full bg-gray-500/10 cursor-pointer text-[15px] text-[oklch(55.1%_.027_264.364)] font-normal rounded-full focus:border-1 focus:border-solid focus:border-primary sm:flex 3xl:w-[56rem] dark:bg-gray-40/20 dark:border'
                type='button'
                onClick={onClick}
            >
                <svg className='me-3' width='1em' height='1em' viewBox='0 0 20 20'>
                    <path
                        d='M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z'
                        stroke='currentColor'
                        fill='none'
                        strokeWidth='2'
                        fillRule='evenodd'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
                {t('Search driver')}...
                {children}
            </button>
        </>
    );
}

export default SearchInput;
