import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ArrowToTop } from '~/components/UiComponents/Icon';

function Footer() {
    const { t } = useTranslation();

    return (
        <footer className='text-sm/loose text-gray-950 bg-white dark:bg-background-dark dark:text-white'>
            <div className='grid grid-cols-1 gap-6 mx-auto w-full sm:grid-cols-2 lg:grid-cols-4'>
                {/* LOGO */}
                <div className='footer_col md:border-b-0'>
                    <Link className='flex gap-2 items-center' to='/'>
                        <img className='w-30' alt='logo' src='/src/assets/images/logo.png' />
                    </Link>
                    <p className='footer-item -mt-4 pl-5'>
                        {t('DriveHub - A comprehensive driver monitoring solution')}
                        <br />
                        {t('Safer - Smarter - With DriveHub')}
                    </p>
                </div>

                {/* ABOUT US */}
                <div className='footer_col md:border-b-0'>
                    <h3 className='footer-title'>{t('About us')}</h3>
                    <p className='footer-item'>
                        {t(
                            'We are final-year Computer Engineering students, passionate about technology and dedicated to applying our knowledge to improve traffic safety and driver monitoring systems',
                        )}
                    </p>
                </div>

                {/* CONTACT */}
                <div className='footer_col md:border-b-0'>
                    <h3 className='footer-title'>{t('Contact')}</h3>
                    <ul className='grid gap-2 mt-4'>
                        <li>
                            <a className='footer-item' href='https://www.facebook.com/toantlsvn'>
                                Tran Le Song Toan
                                <span>
                                    <ArrowToTop />
                                </span>
                            </a>
                        </li>
                        <li>
                            <a className='footer-item' href='https://www.facebook.com/anh.tuan.532095'>
                                Ho Anh Tuan
                                <span>
                                    <ArrowToTop />
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* LINKS */}
                <div className='py-10 px-4'>
                    <h3 className='footer-title'>{t('Link')}</h3>
                    <ul className='grid gap-2 mt-4'>
                        <li>
                            <Link className='footer-item' to='/'>
                                {t('Overview')}
                            </Link>
                        </li>
                        <li>
                            <Link className='footer-item' to='/drivers/list'>
                                {t('List drivers')}
                            </Link>
                        </li>
                        <li>
                            <Link className='footer-item' to='/contact'>
                                {t('Contact')}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
