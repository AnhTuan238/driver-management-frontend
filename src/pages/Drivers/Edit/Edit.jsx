import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';

import { TickIconCustom, ErrorIcon } from '~/components/UiComponents/Icon';
import CustomForm from '~/components/UiComponents/CustomForm';
import { loginSuccess } from '~/redux/authenticationSlice';
import Spinner from '~/components/UiComponents/Spinner';
import Modal from '~/components/LayoutComponents/Modal';
import { createAxios } from '~/createInstance';
import { getDetailDriver, updateDriver } from '~/api/driver';
import { runWithMinDelay } from '~/utils/artificialLatency';

function EditDriver() {
    const [modalType, setModalType] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [driver, setDriver] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { id } = useParams();
    const driverCurrent = useSelector((state) => state.authentication.login?.currentDriver);
    let axiosJWT = createAxios(driverCurrent, dispatch, loginSuccess);

    useEffect(() => {
        const fetchDriver = async (id) => {
            try {
                const response = await getDetailDriver(id);
                return setDriver(response);
            } catch (error) {
                console.log(error);
                setErrorMessage(error.response.data.message);
            }
        };

        fetchDriver(id);
    }, []);

    const initialValues = {
        firstName: driver?.firstName || '',
        lastName: driver?.lastName || '',
        idDriver: driver?.idDriver || '',
        phone: driver?.phone || '',
        emailAddress: driver?.emailAddress || '',
        country: driver?.country || '',
        city: driver?.city || '',
        dateOfBirth: driver?.dateOfBirth ? driver?.dateOfBirth.slice(0, 10) : '',
        zone: driver?.zone || '',
        licensePlate: driver?.licensePlate || '',
        password: '',
        admin: driver?.admin === true ? true : false,
        avatar: null,
    };

    const validationSchema = Yup.object({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        emailAddress: Yup.string().email('Must be a valid email address').required('Email is required'),
        idDriver: Yup.string().required('Driver Id is required'),
        phone: Yup.string()
            .matches(/^[0-9]+$/, 'Must be a valid phone number')
            .required('Mobile number is required'),
        country: Yup.string().required('Country is required'),
        city: Yup.string().required('City is required'),
        dateOfBirth: Yup.date().required('Date of birth is required'),
        zone: Yup.string().required('Zone is required'),
        // password: Yup.string().required(t('Password is required')),
        licensePlate: Yup.string().required('License Plate is required'),
        admin: Yup.string().oneOf(['true', 'false'], t('Role is required')).required(t('Role is required')),
        // avatar: Yup.mixed()
        //             .required(t('Avatar is required'))

        //             .test(
        //                 'fileFormat',
        //                 t('Unsupported file format'),
        //                 (value) => !value || (value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type)),
        //             ),
    });

    const fields = [
        { label: 'First Name', name: 'firstName', type: 'text', placeholder: 'Enter first name...' },
        { label: 'Last Name', name: 'lastName', type: 'text', placeholder: 'Enter last name...' },
        { label: 'Driver Id', name: 'idDriver', type: 'text', placeholder: 'Enter id...' },
        { label: 'Password', name: 'password', type: 'text', placeholder: 'Password' },
        { label: 'Email Address', name: 'emailAddress', type: 'text', placeholder: 'Enter email...' },
        { label: 'Mobile Number', name: 'phone', type: 'text', placeholder: 'Enter phone number...' },
        { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', placeholder: 'Enter date of birth...' },
        { label: 'Country', name: 'country', type: 'text', placeholder: 'Enter country...' },
        { label: 'City', name: 'city', type: 'text', placeholder: 'Enter city...' },
        { label: 'Zone', name: 'zone', type: 'text', placeholder: 'Enter zone...' },
        { label: 'License Plate', name: 'licensePlate', type: 'text', placeholder: 'Enter license plate...' },
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

    const handleUpdate = async (values) => {
        setIsLoading(true);
        try {
            await runWithMinDelay(() => updateDriver(id, values, driverCurrent?.accessToken, axiosJWT), 800);
            setModalType('updateSuccess');
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong!';

            setErrorMessage(errorMessage);
            setModalType('updateFailed');
            console.error('API call Failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = () => {
        setModalType(null);
        navigate('/drivers/list');
    };

    const handleCloseModal = () => {
        setModalType(null);
    };

    return (
        <>
            <Helmet>
                <title>{t('Edit Driver - DriveHub')}</title>
            </Helmet>
            <h1 className='heading'>{t('EDIT DRIVER INFORMATION')}</h1>

            {driver ? (
                <CustomForm
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    buttonForm={t('Update Driver')}
                    onSubmit={handleUpdate}
                    fields={fields}
                />
            ) : (
                <Spinner />
            )}

            {isLoading && <Spinner />}

            {modalType === 'updateSuccess' && (
                <Modal
                    icon={<TickIconCustom />}
                    color='var(--color-success)'
                    message={t('Driver information updated successfully!')}
                    description={t(
                        "Click 'Confirm' to return to the driver list, or 'Continue editing' to keep editing the driver information",
                    )}
                    primaryActionLabel={t('Confirm')}
                    secondaryActionLabel={t('Continue editing')}
                    onPrimaryAction={handleConfirm}
                    onSecondaryAction={handleCloseModal}
                />
            )}

            {modalType === 'updateFailed' && (
                <Modal
                    icon={<ErrorIcon />}
                    color='var(--color-failure)'
                    message={t('Failed to edit driver!')}
                    description={errorMessage}
                    primaryActionLabel={t('Confirm')}
                    onPrimaryAction={handleCloseModal}
                />
            )}
        </>
    );
}

export default EditDriver;
