import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Tippy from '@tippyjs/react/headless';

import logo from '~/assets/images/logo.png';
import logoDark from '~/assets/images/logo-dark.png';

import {
    MoonIconCustom,
    LanguageIconCustom,
    TickIconCustom,
    SearchIcon,
    BarIcon,
    CloseIcon,
    SunIcon,
    SignIn,
    SignOut,
    UserNoBorderIcon,
    TrashIcon,
} from '~/components/UiComponents/Icon';
import DriverList from '~/components/UiComponents/DriverList/DriverList';
import { logoutSuccess } from '~/redux/authenticationSlice';
import useKeyboardShortcuts from '~/hooks/useShortCuts';
import Modal from '~/components/LayoutComponents/Modal';
import Spinner from '~/components/UiComponents/Spinner';
import Search from '~/components/UiComponents/Search';
import Button from '~/components/UiComponents/Button';
import { logoutRequest } from '~/api/authentication';
import { loginRequest } from '~/api/authentication';
import { createAxios } from '~/createInstance';
import useTheme from '~/hooks/useTheme';

function Navbar() {
    const [isLoginSuccessModal, setIsLoginSuccessModal] = useState(false);
    const [isLoginFailureModal, setIsLoginFailureModal] = useState(false);
    const [isSearchModal, setIsSearchModal] = useState(false);
    const [isMobileMenu, setIsMobileMenu] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const { toggleTheme, theme } = useTheme();
    const { t, i18n } = useTranslation();
    const [id, setId] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const driver = useSelector((state) => state.authentication.login.currentDriver);
    const accessToken = driver?.accessToken;
    let axiosJWT = createAxios(driver, dispatch, logoutSuccess);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    useKeyboardShortcuts({
        onOpen: () => setIsSearchModal(true),
        onClose: () => setIsSearchModal(false),
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const newDriver = {
            idDriver: id,
            password: password,
        };
        const loginPromise = loginRequest(newDriver, dispatch, navigate);
        const wait800ms = new Promise((resolve) => setTimeout(resolve, 800));
        try {
            await Promise.all([loginPromise, wait800ms]);
            setIsLoading(false);
            setIsLoginSuccessModal(true);
        } catch (err) {
            await wait800ms;
            setIsLoading(false);
            setIsLoginFailureModal(true);
            setErrorMessage(err.response?.data?.message || 'Try again!');
        }
    };

    const handleLogout = () => {
        setId('');
        setPassword('');
        logoutRequest(driver, dispatch, navigate, accessToken, axiosJWT);
    };

    const handleConfirm = () => {
        setIsLoginSuccessModal(false);
        navigate('/drivers/list');
    };

    const handleCloseModal = () => {
        setIsLoginSuccessModal(false);
        setIsLoginFailureModal(false);
    };

    return (
        <>
            <div className='fixed inset-x-0 top-0 z-100 bg-white border-b border-border dark:bg-background-dark/97'>
                <div className='flex items-center justify-between gap-8 px-2 z-99 h-14 shadow-lg lg:px-4'>
                    {/* LEFT */}
                    <div className='flex items-center justify-center gap-6'>
                        {/* BAR */}
                        <Button
                            className='nav-link justify-items-center p-1! lg:hidden dark:hover:bg-hover-dark'
                            onClick={() => setIsMobileMenu(!isMobileMenu)}
                        >
                            {isMobileMenu ? (
                                <CloseIcon className='size-8 dark:text-primary' />
                            ) : (
                                <BarIcon className='size-8 dark:text-white' />
                            )}
                        </Button>

                        {/* LOGO*/}
                        <div className='flex items-center justify-center'>
                            <Link className='shrink-0 flex items-center gap-0' to='/'>
                                {theme === 'light' ? (
                                    <img className='w-20' src={logo} alt='' />
                                ) : (
                                    <img className='w-20' src={logoDark} alt='' />
                                )}
                            </Link>
                        </div>

                        {/* LINK */}
                        <div className='flex items-center hidden lg:flex gap-4'>
                            <NavLink className='nav-link' to='/'>
                                {t('DriveHub')}
                            </NavLink>
                            <NavLink className='nav-link' to='/drivers/list'>
                                {t('Drivers')}
                            </NavLink>
                            <NavLink className='nav-link' to='/drivers/add'>
                                {t('Add driver')}
                            </NavLink>
                            <NavLink className='nav-link' to='/contact'>
                                {t('Contact')}
                            </NavLink>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className='flex items-center gap-6'>
                        {/* SEARCH */}
                        <Search onClick={() => setIsSearchModal((prev) => !prev)} />
                        <button
                            className='nav-link w-12 sm:w-12 sm:hidden'
                            onClick={() => setIsSearchModal((prev) => !prev)}
                        >
                            <SearchIcon className='size-6' />
                        </button>

                        {/* LANGUAGE */}
                        <Tippy
                            interactive
                            placement='bottom-end'
                            trigger={isMobile ? 'click' : 'mouseenter focus'}
                            delay={[0, 700]}
                            offset={[0, 12]}
                            render={(attrs) => (
                                <div
                                    className='flex flex-col items-start min-w-45 shadow-md bg-white rounded-sm dark:bg-background-dark dark:shadow-xl'
                                    tabIndex='-1'
                                    {...attrs}
                                >
                                    <p className='px-4 py-2 w-full font-bold border-b border-border cursor-default dark:text-white-dark'>
                                        {t('Select Language')}
                                    </p>
                                    <ul className='w-full'>
                                        <li className='language-item'>
                                            <div
                                                className='nav-link flex items-center gap-2 text-[15px] pl-4 font-semibold'
                                                onClick={() => i18n.changeLanguage('en')}
                                            >
                                                {t('English')}
                                            </div>
                                        </li>
                                        <li className='language-item'>
                                            <div
                                                className='nav-link flex items-center gap-2 text-[15px] pl-4 font-semibold'
                                                onClick={() => i18n.changeLanguage('ja')}
                                            >
                                                {t('Japanese')}
                                            </div>
                                        </li>
                                        <li className='language-item'>
                                            <div
                                                className='nav-link flex items-center gap-2 text-[15px] pl-4 font-semibold'
                                                onClick={() => i18n.changeLanguage('vi')}
                                            >
                                                {t('Vietnamese')}
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        >
                            <button className='nav-link flex justify-center relative p-2 sm:w-15 dark:before:-bottom-4'>
                                <LanguageIconCustom className='size-6' />
                            </button>
                        </Tippy>

                        {/* THEME */}
                        <button
                            className='nav-link flex justify-center p-2! sm:w-15 dark:hover:bg-hover-dark'
                            onClick={toggleTheme}
                        >
                            {theme === 'light' ? <MoonIconCustom className='size-6' /> : <SunIcon className='size-6' />}
                        </button>

                        {/* DRIVER */}
                        {driver ? (
                            <Tippy
                                interactive
                                placement='bottom-end'
                                trigger={isMobile ? 'click' : 'mouseenter focus'}
                                delay={[0, 700]}
                                offset={[0, 12]}
                                render={(attrs) => (
                                    <div
                                        className='flex flex-col items-start w-48 shadow-md bg-white rounded-sm dark:bg-background-dark dark:shadow-xl'
                                        tabIndex='-1'
                                        {...attrs}
                                    >
                                        <p className='px-4 py-2 w-full font-bold border-b border-border cursor-default  dark:text-white-dark'>
                                            {t('Hi')} {`${driver.firstName.trim().split(' ').pop()}!`}
                                        </p>
                                        <ul className='w-full'>
                                            <li className='language-item'>
                                                <Link
                                                    to={`/drivers/${driver.idDriver}`}
                                                    className='nav-link flex items-center gap-2 text-[15px] font-semibold'
                                                >
                                                    <UserNoBorderIcon className='size-6' />
                                                    {t('Profile')}
                                                </Link>
                                            </li>
                                            <li className='language-item'>
                                                <Link
                                                    to='/drivers/trash'
                                                    className='nav-link flex items-center gap-2 text-[15px] font-semibold'
                                                >
                                                    <TrashIcon className='size-6' />
                                                    {t('Trash')}
                                                </Link>
                                            </li>
                                            <li className='language-item border-t border-border'>
                                                <button
                                                    onClick={handleLogout}
                                                    className='nav-link flex items-center gap-2 text-[15px] font-semibold'
                                                >
                                                    <SignOut className='size-6' />
                                                    {t('Log out')}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            >
                                <div className='flex gap-1 items-center cursor-pointer'>
                                    <img
                                        className='rounded-full w-10 h-10 min-w-10 object-cover'
                                        src={driver.avatar}
                                        alt='Avatar'
                                    />
                                    <p className='nav-link text-primary font-semibold hover:bg-transparent'>
                                        {driver.lastName} {driver.firstName}
                                    </p>
                                </div>
                            </Tippy>
                        ) : (
                            <>
                                <form onSubmit={handleLogin} className='hidden xl:flex xl:gap-2'>
                                    <input
                                        type='text'
                                        placeholder={t('User Id')}
                                        onChange={(e) => setId(e.target.value)}
                                        className='input-nav focus:outline-primary'
                                    />
                                    <input
                                        type='password'
                                        placeholder={t('Password')}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='input-nav focus:outline-primary'
                                    />
                                    <button type='submit' className='nav-link bg-primary text-white'>
                                        {t('Login')}
                                    </button>
                                </form>
                                <Link
                                    to='/authentication/login'
                                    className='nav-link flex gap-1 items-center text-white bg-primary xl:hidden'
                                >
                                    <SignIn className='size-4' />
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMobileMenu && (
                <div className='hambuger-menu fixed top-14 z-9 inset-0 bg-white lg:hidden dark:bg-background-dark'>
                    {/* LINK */}
                    <div className='flex items-center justify-between px-4 py-3 gap-2 border-border border-b dark:border-border-dark'>
                        <NavLink
                            className='nav-link dark:text-white dark:font-semibold dark:hover:bg-hover-dark'
                            to='/'
                            onClick={() => setIsMobileMenu(false)}
                        >
                            {t('DriveHub')}
                        </NavLink>
                        <NavLink
                            className='nav-link dark:text-text-dark dark:font-semibold dark:hover:bg-hover-dark'
                            to='/drivers/list'
                            onClick={() => setIsMobileMenu(false)}
                        >
                            {t('Drivers')}
                        </NavLink>
                        <NavLink
                            className='nav-link dark:text-text-dark dark:font-semibold dark:hover:bg-hover-dark'
                            to='/drivers/add'
                            onClick={() => setIsMobileMenu(false)}
                        >
                            {t('Add driver')}
                        </NavLink>
                        <NavLink
                            className='nav-link dark:text-text-dark dark:font-semibold dark:hover:bg-hover-dark'
                            to='/contact'
                            onClick={() => setIsMobileMenu(false)}
                        >
                            {t('Contact')}
                        </NavLink>
                    </div>

                    {/* DRIVER LIST */}
                    <div>
                        <h2 className='px-6 pt-3 text-text font-bold dark:text-[#99A1B3]'>Drivers</h2>
                        <DriverList
                            className='flex flex-col pt-3 '
                            hideAvatar={true}
                            onClick={() => setIsMobileMenu(false)}
                        />
                    </div>
                </div>
            )}

            {/* MODAL SEARCH */}
            {isSearchModal ? (
                <Modal customClassName='relative py-4! px-0! max-w-3xl! h-170' onClose={() => setIsSearchModal(false)}>
                    <Search />
                </Modal>
            ) : null}

            {isLoading && <Spinner />}

            {isLoginSuccessModal && (
                <Modal
                    icon={<TickIconCustom />}
                    color='var(--color-success)'
                    message={t('Login Success!')}
                    description={t("Click 'Confirm' to return to the driver list page.")}
                    primaryActionLabel={t('Confirm')}
                    onPrimaryAction={handleConfirm}
                />
            )}

            {isLoginFailureModal && (
                <Modal
                    icon={<CloseIcon />}
                    color='var(--color-failure)'
                    message={t('Failed to login!')}
                    description={t(errorMessage)}
                    primaryActionLabel={t('Confirm')}
                    onPrimaryAction={handleCloseModal}
                />
            )}
        </>
    );
}

export default Navbar;
