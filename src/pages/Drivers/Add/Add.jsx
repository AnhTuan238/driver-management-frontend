import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import * as Yup from 'yup';

import { TickIconCustom, ErrorIcon } from '~/components/UiComponents/Icon';
import CustomForm from '~/components/UiComponents/CustomForm';
import { runWithMinDelay } from '~/utils/artificialLatency';
import { loginSuccess } from '~/redux/authenticationSlice';
import Spinner from '~/components/UiComponents/Spinner';
import Modal from '~/components/LayoutComponents/Modal';
import { createAxios } from '~/createInstance';
import { addDriver } from '~/api/driver';

function Add() {
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalType, setModalType] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const driver = useSelector((state) => state.authentication.login?.currentDriver);
    let axiosJWT = createAxios(driver, dispatch, loginSuccess);

    const initialValues = {
        firstName: '',
        lastName: '',
        idDriver: '',
        phone: '',
        emailAddress: '',
        country: '',
        city: '',
        dateOfBirth: '',
        zone: '',
        licensePlate: '',
        password: '',
        admin: '',
        avatar: null,
    };

    const validationSchema = Yup.object({
        firstName: Yup.string().required(t('First Name is required')),
        lastName: Yup.string().required(t('Last Name is required')),
        emailAddress: Yup.string().email(t('Must be a valid email address')).required(t('Email is required')),
        idDriver: Yup.string().required(t('Driver Id is required')),
        phone: Yup.string()
            .matches(/^[0-9]+$/, 'Must be a valid phone number')
            .required(t('Mobile number is required')),
        country: Yup.string().required(t('Country is required')),
        city: Yup.string().required(t('City is required')),
        dateOfBirth: Yup.date().required(t('Date of birth is required')),
        zone: Yup.string().required(t('Zone is required')),
        password: Yup.string().required(t('Password is required')),
        licensePlate: Yup.string().required(t('License Plate is required')),
        admin: Yup.string().oneOf(['true', 'false'], t('Role is required')).required(t('Role is required')),
        avatar: Yup.mixed()
            .required(t('Avatar is required'))

            .test(
                'fileFormat',
                t('Unsupported file format'),
                (value) => !value || (value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type)),
            ),
    });

    const fields = [
        { label: 'First Name', name: 'firstName', type: 'text', placeholder: 'First Name' },
        { label: 'Last Name', name: 'lastName', type: 'text', placeholder: 'Last Name' },
        { label: 'Driver Id', name: 'idDriver', type: 'text', placeholder: 'Driver Id' },
        { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
        { label: 'Email Address', name: 'emailAddress', type: 'text', placeholder: 'Email Address' },
        { label: 'Mobile Number', name: 'phone', type: 'text', placeholder: 'Mobile Number' },
        { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', placeholder: 'Date of Birth' },
        { label: 'Country', name: 'country', type: 'text', placeholder: 'Country' },
        { label: 'City', name: 'city', type: 'text', placeholder: 'City' },
        { label: 'Zone', name: 'zone', type: 'text', placeholder: 'Zone' },
        { label: 'License Plate', name: 'licensePlate', type: 'text', placeholder: 'License Plate' },
        {
            label: 'Role',
            name: 'admin',
            type: 'select',
            placeholder: 'Select Role',
            options: [
                { label: 'Admin', value: 'true' },
                { label: 'Driver', value: 'false' },
            ],
        },
        { label: 'Upload Avatar', name: 'avatar', type: 'file', placeholder: 'Select avatar', fileUpload: true },
    ];

    const handleAdd = async (values) => {
        setIsLoading(true);
        try {
            await runWithMinDelay(() => addDriver(values, driver?.accessToken, axiosJWT), 800);
            setModalType('addSuccess');
        } catch (error) {
            const errMessage =
                error?.response?.data?.message || 'Something went wrong. Please try again in a few seconds!';
            setErrorMessage(errMessage);
            setModalType('addFailed');
            console.error('API call Failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = () => {
        setModalType(null);
        navigate('/drivers/list');
    };

    const handleCancel = () => {
        setModalType(null);
    };

    return (
        <>
            <Helmet>
                <title>{t('Add driver - DriveHub')}</title>
            </Helmet>
            <h1 className='heading'>{t('ADD DRIVER')}</h1>

            {/* Form */}
            <CustomForm
                initialValues={initialValues}
                fields={fields}
                validationSchema={validationSchema}
                buttonForm='Add driver'
                onSubmit={handleAdd}
            />

            {isLoading && <Spinner />}

            {modalType === 'addSuccess' && (
                <Modal
                    icon={<TickIconCustom />}
                    color='var(--color-success)'
                    message={t('Driver added successfully.')}
                    description={t("Click 'Confirm' to return to the driver list.")}
                    primaryActionLabel={t('Confirm')}
                    onPrimaryAction={handleConfirm}
                />
            )}

            {modalType === 'addFailed' && (
                <Modal
                    icon={<ErrorIcon />}
                    color='var(--color-failure)'
                    message={t('Failed to add driver.')}
                    description={errorMessage}
                    primaryActionLabel={t('Confirm')}
                    onPrimaryAction={handleCancel}
                />
            )}
        </>
    );
}

export default Add;
