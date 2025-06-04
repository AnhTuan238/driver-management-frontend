import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import { MobileIcon, AddressIcon, WebIcon, MailIcon, UserIcon, ArrowToTop } from '~/components/UiComponents/Icon';

function Contact() {
    const { t } = useTranslation();
    return (
        <>
            <Helmet>
                <title>{t('Contact - DriveHub')}</title>
            </Helmet>

            <h1 className='heading dark:text-white-dark'>{t('CONTACT')}</h1>

            <div className='grid grid-cols-1 gap-4 mb-8 md:grid-cols-2'>
                {/* LOGO */}
                <div className='dark:text-white'>
                    <img
                        className='justify-self-center w-80 md:justify-self-start md:-ml-13'
                        src='src/assets/images/logo.png'
                        alt='UTE'
                    />

                    {/* TITLE */}
                    <h2 className='-mt-12 contact-header dark:text-white-dark'>
                        {t('HCMC University of Technology and Education')}
                    </h2>

                    {/* INFO */}
                    <div className='flex flex-col gap-4 mt-4'>
                        {/* PHONE */}
                        <div className='contact-item'>
                            <MobileIcon className='size-6' />
                            <p className='contact-content dark:text-white-dark'>
                                {t('Phone')}: <span className='font-semibold'>(+84 - 028) 38968641 </span>
                            </p>
                        </div>

                        {/* ADDRESS */}
                        <div className='contact-item'>
                            <AddressIcon className='size-6' />
                            <p className='contact-content dark:text-white-dark'>
                                {t('Address')}:{' '}
                                <span className='font-semibold'>
                                    {t('1 Vo Van Ngan Street, Thu Duc City, Ho Chi Minh City')}{' '}
                                </span>
                            </p>
                        </div>

                        {/* WEBSITE */}
                        <div className='contact-item'>
                            <WebIcon className='size-6' />
                            <p className='contact-content dark:text-white-dark'>
                                {t('Website')}:{' '}
                                <a className='font-semibold text-primary ' href='https://hcmute.edu.vn/'>
                                    https://hcmute.edu.vn
                                    <ArrowToTop />
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-8 mt-4 dark:text-white-dark'>
                    {/* Teacher */}
                    <div>
                        {/* TITLE */}
                        <h2 className='contact-header dark:text-white-dark'>{t('Project Supervisor')}</h2>

                        {/* INFO */}
                        <div className='flex flex-col gap-4 mt-4'>
                            {/* USER */}
                            <div className='contact-item font-semibold'>
                                <UserIcon className='size-6' />
                                <p className='contact-content dark:text-white-dark'>Nguyen Ngo Lam</p>
                            </div>

                            {/* PHONE */}
                            <div className='contact-item'>
                                <MobileIcon className='size-6' />
                                <p className='contact-content dark:text-white-dark'>
                                    {t('Phone')}: <span className='font-semibold'>0908 434 763</span>
                                </p>
                            </div>

                            {/* MAIL */}
                            <div className='contact-item'>
                                <MailIcon className='size-6' />
                                <p className='contact-content dark:text-white-dark'>
                                    {t('Email')}:{' '}
                                    <a className='font-semibold text-primary' href='mailto:lamnn@hcmute.edu.vn'>
                                        lamnn@hcmute.edu.vn
                                        <ArrowToTop />
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Student 1 */}
                    <div>
                        {/* TITLE */}
                        <h2 className='contact-header dark:text-white-dark'>{t('Project Implementer')}</h2>

                        {/* INFO */}
                        <div className='flex flex-col gap-4 mt-4'>
                            {/* USER */}
                            <div className='contact-item font-semibold'>
                                <UserIcon className='size-6' />
                                <p className='contact-content dark:text-white-dark'>Tran Le Song Toan</p>
                            </div>

                            {/* PHONE */}
                            <div className='contact-item'>
                                <MobileIcon className='size-6' />
                                <p className='contact-content dark:text-white-dark'>
                                    {t('Phone')}: <span className='font-semibold'>0888 843 821</span>
                                </p>
                            </div>

                            {/* MAIL */}
                            <div className='contact-item'>
                                <MailIcon className='size-6' />
                                <p className='contact-content dark:text-white-dark'>
                                    {t('Email')}:{' '}
                                    <a className='font-semibold text-primary' href='mailto: transongtoan2003@gmail.com'>
                                        transongtoan2003@gmail.com
                                        <ArrowToTop />
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Student 2 */}
                    <div>
                        {/* TITLE */}
                        <h2 className='contact-header dark:text-white-dark'>{t('Project Implementer')}</h2>

                        {/* INFO */}
                        <div className='flex flex-col gap-4 mt-4'>
                            {/* USER */}
                            <div className='contact-item font-semibold'>
                                <UserIcon className='size-6' />
                                <p className='contact-content dark:text-white-dark'>Ho Anh Tuan</p>
                            </div>

                            {/* PHONE */}
                            <div className='contact-item'>
                                <MobileIcon className='size-6' />
                                <p className='contact-content dark:text-white-dark'>
                                    {t('Phone')}: <span className='font-semibold'>0941 412 299</span>
                                </p>
                            </div>

                            {/* MAIL */}
                            <div className='contact-item'>
                                <MailIcon className='size-6' />
                                <p className='contact-content dark:text-white-dark'>
                                    {t('Email')}:{' '}
                                    <a className='font-semibold text-primary' href='mailto:hoanhtuan23082003@gmail.com'>
                                        hoanhtuan23082003@gmail.com
                                        <ArrowToTop />
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;
