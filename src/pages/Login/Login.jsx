import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import * as Yup from 'yup';

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
import CustomForm from '~/components/UiComponents/CustomForm';
import { loginRequest } from '~/api/authentication';
import variants from '~/components/UiComponents/Button/variants';
import Modal from '~/components/LayoutComponents/Modal';
import Spinner from '~/components/UiComponents/Spinner';

function Login() {
    const [isLoginSuccessModal, setIsLoginSuccessModal] = useState(false);
    const [isLoginFailureModal, setIsLoginFailureModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const initialValues = {
        idDriver: '',
        password: '',
    };

    const validationSchema = Yup.object({
        idDriver: Yup.string().required(t('Driver Id is required')),
        password: Yup.string().required(t('Password is required')),
    });

    const fields = [
        { label: 'Driver Id', name: 'idDriver', type: 'text', placeholder: 'Driver Id' },
        { label: 'Password', name: 'password', type: 'text', placeholder: 'Password' },
    ];

    const handleLogin = async (values) => {
        setIsLoading(true);

        const newDriver = {
            idDriver: values.idDriver,
            password: values.password,
        };

        const loginPromise = loginRequest(newDriver, dispatch);
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

    const handleConfirm = () => {
        setIsLoginSuccessModal(false);
        navigate('/drivers/list');
    };

    const handleCloseModal = () => {
        setIsLoginSuccessModal(false);
        setIsLoginFailureModal(false);
    };

    return (
        <div className='px-8 pb-8 w-full max-w-sm text-center bg-white rounded-lg shadow-lg dark:bg-background-dark'>
            <div>
                <img src='/src/assets/images/logo.png' alt='' className='w-40 justify-self-center' />
                <h1 className='text-3xl text-black font-bold -mt-4 mb-1'>Welcome back</h1>
                <p className='text-sm text-gray-400'>Log in to personalize your experience!</p>
            </div>
            <div className='form-login'>
                <CustomForm
                    initialValues={initialValues}
                    fields={fields}
                    validationSchema={validationSchema}
                    className='sm:block! text-start'
                    buttonForm='Login'
                    onSubmit={handleLogin}
                />
                <div className='flex items-center gap-4 mt-6 text-gray-500'>
                    <span className='flex-1 border-t border-gray-300'></span>
                    <span>OR</span>
                    <span className='flex-1 border-t border-gray-300'></span>
                </div>
                <Link to='/drivers/list' className='block text-base text-primary mt-4'>
                    Continue as Viewer
                </Link>
            </div>

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
        </div>
    );
}

export default Login;
