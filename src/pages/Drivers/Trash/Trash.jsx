import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import { getAllDriversInTrash, restoreDriver, forceDeleteDriver } from '~/api/driver';
import { ArrowBack, WarningIcon, CloseIcon } from '~/components/UiComponents/Icon';
import { TickIconCustom } from '~/components/UiComponents/Icon/Icon';
import variants from '~/components/UiComponents/Button/variants';
import { loginSuccess } from '~/redux/authenticationSlice';
import Spinner from '~/components/UiComponents/Spinner';
import Modal from '~/components/LayoutComponents/Modal';
import Button from '~/components/UiComponents/Button';
import { createAxios } from '~/createInstance';
import { addToast } from '~/redux/toastSlice';

function Trash() {
    const [isRestoreSuccessModal, setIsRestoreSuccessModal] = useState(false);
    const [isRestoreFailureModal, setIsRestoreFailureModal] = useState(false);
    const [isDeleteSuccessModal, setIsDeleteSuccessModal] = useState(false);
    const [isDeleteFailureModal, setIsDeleteFailureModal] = useState(false);
    const [isConfirmDeleteModal, setIsConfirmDeleteModal] = useState(false);
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [originalDrivers, setOriginalDrivers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filterDate, setFilterDate] = useState('');
    const [filterZone, setFilterZone] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [drivers, setDrivers] = useState([]);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const driver = useSelector((state) => state.authentication.login?.currentDriver);
    const isAdmin = driver?.admin;
    let axiosJWT = createAxios(driver, dispatch, loginSuccess);

    useEffect(() => {
        const fetchDriversInTrash = async () => {
            try {
                const response = await getAllDriversInTrash();
                setDrivers(response);
                setOriginalDrivers(response);
            } catch (error) {
                console.error('API call failed:', error);
            }
        };

        fetchDriversInTrash();
    }, []);

    const handleRestore = async (id) => {
        setIsLoading(true);
        try {
            await restoreDriver(id, driver?.accessToken, axiosJWT);
            setTimeout(() => {
                setIsLoading(false);
                setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.idDriver !== id));
                setOriginalDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.idDriver !== id));
                setIsRestoreSuccessModal(true);
                setSelectedDriverId(null);
            }, 800);
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Something went wrong';
            setErrorMessage(errorMessage);
            setIsLoading(false);
            setIsRestoreFailureModal(true);
            console.error('API call failed: ', error);
        }
    };

    const handleClickDeleteButton = (id) => {
        setIsConfirmDeleteModal(true);
        setSelectedDriverId(id);
    };

    const handleDelete = async () => {
        setIsConfirmDeleteModal(false);
        setIsLoading(true);

        try {
            await forceDeleteDriver(selectedDriverId, driver?.accessToken, axiosJWT);
            setTimeout(() => {
                setIsLoading(false);
                setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.idDriver !== selectedDriverId));
                setOriginalDrivers((prevDrivers) =>
                    prevDrivers.filter((driver) => driver.idDriver !== selectedDriverId),
                );
                setIsDeleteSuccessModal(true);
                setSelectedDriverId(null);
            }, 800);
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Something went wrong';
            setErrorMessage(errorMessage);
            setIsLoading(false);
            setIsDeleteFailureModal(true);
            console.error('API call failed: ', error);
        }
    };

    const handleCloseModal = () => {
        setIsDeleteSuccessModal(false);
        setIsDeleteFailureModal(false);
        setIsRestoreSuccessModal(false);
        setIsRestoreFailureModal(false);
        setIsConfirmDeleteModal(false);
    };

    const handleFilter = () => {
        let filtered = [...originalDrivers];

        if (filterZone === 'Ha Noi' || filterZone === 'Ho Chi Minh') {
            filtered = filtered.filter((driver) => driver.zone === filterZone);
        } else if (filterZone === 'Others') {
            filtered = filtered.filter((driver) => driver.zone !== 'Ha Noi' && driver.zone !== 'Ho Chi Minh');
        }

        if (filterRole) {
            filtered = filtered.filter((driver) => (filterRole === 'Admin' ? driver.admin : !driver.admin));
        }

        if (filterDate) {
            const now = new Date();
            filtered = filtered.filter((driver) => {
                const addedDate = new Date(driver.createdAt);
                if (filterDate === 'This Month') {
                    return addedDate.getMonth() === now.getMonth() && addedDate.getFullYear() === now.getFullYear();
                }
                if (filterDate === 'This Year') {
                    return addedDate.getFullYear() === now.getFullYear();
                }
                return true;
            });
        }

        setDrivers(filtered);
    };

    return (
        <>
            <Helmet>
                <title>{t('Trash - DriveHub')}</title>
            </Helmet>
            <h1 className='heading dark:text-white-dark'>{t('TRASH')}</h1>
            {/* TITLE, BUTTON */}
            <div className='flex items-center justify-between mb-4'>
                <div>
                    <div className='flex items-center gap-2 mb-1 '>
                        <h2 className='text-sm font-semibold dark:text-white-dark'>{t('Drivers in trash')}</h2>
                        <span className='flex items-center justify-center text-sm text-primary font-bold p-2.5 w-2 h-2 rounded-full border-2 border-secondary '>
                            {originalDrivers.length}
                        </span>
                    </div>
                    <p className='text-text text-sm! dark:text-white-dark'>{t('Manage your drivers')}</p>
                </div>
                <Button className={variants.primaryBtn} to='/drivers/list' leftIcon={<ArrowBack className='size-5' />}>
                    {t('Back to Drivers')}
                </Button>
            </div>

            <div>
                {/* FILTER */}
                <div className='flex flex-wrap items-center justify-between gap-2 py-4 border-t border-border'>
                    {/* Bộ lọc */}
                    <div className='flex flex-wrap items-center gap-2'>
                        <div className='filter-item'>
                            {t('Date added:')}
                            <select
                                onChange={(e) => setFilterDate(e.target.value)}
                                className='focus:outline-none w-16 truncate'
                            >
                                <option value=''>{t('All')}</option>
                                <option value='This Month'>{t('This Month')}</option>
                                <option value='This Year'>{t('This Year')}</option>
                            </select>
                        </div>
                        <div className='filter-item'>
                            {'Zone:'}
                            <select
                                onChange={(e) => setFilterZone(e.target.value)}
                                className='focus:outline-none w-16 truncate'
                            >
                                <option value=''>{t('All')}</option>
                                <option value='Ha Noi'>{t('Ha Noi')}</option>
                                <option value='Ho Chi Minh'>{t('Ho Chi Minh')}</option>
                                <option value='Others'>{t('Other places')}</option>
                            </select>
                        </div>
                        <div className='filter-item'>
                            {t('Role')}:
                            <select
                                onChange={(e) => setFilterRole(e.target.value)}
                                className='focus:outline-none w-16 truncate'
                            >
                                <option value=''>{t('All')}</option>
                                <option value='Admin'>{t('Admin')}</option>
                                <option value='Driver'>{t('Driver')}</option>
                            </select>
                        </div>
                        <button
                            onClick={handleFilter}
                            className='flex gap-1 cursor-pointer items-center text-secondary text-sm font-medium dark:text-white-dark'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='size-5 dark:text-white-dark'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z'
                                />
                            </svg>
                            {t('Filters')}
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className='overflow-x-auto'>
                    <table className='text-text min-w-full divide-y divide-gray-200 rounded-lg shadow table-auto'>
                        <thead className='bg-border dark:bg-background-dark'>
                            <tr>
                                <th className='table-item w-13'>#</th>
                                <th className='table-item w-61'>{t('Name')}</th>
                                <th className='table-item w-41'>{t('License Plate')}</th>
                                <th className='table-item w-43'>{t('ID')}</th>
                                <th className='table-item w-38'>{t('Mobile')}</th>
                                <th className='table-item w-39'>{t('Date of Birth')}</th>
                                <th className='table-item w-46'>{t('Zone')}</th>
                                <th className='table-item text-center w-25'>{t('Role')}</th>
                                <th className='table-item text-center w-37'></th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200 dark:bg-background-dark'>
                            {drivers.length === 0 ? (
                                <tr>
                                    <td className='text-center text-sm font-medium' colSpan='10'>
                                        <div className='mt-4 dark:text-white-dark uppercase'>
                                            {t('No drivers available')}!
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                drivers.map((driver, index) => (
                                    <tr key={index}>
                                        <td className='table-item w-13'>{index + 1}</td>
                                        <td className='table-item gap-1 w-61'>
                                            <div className='flex items-center gap-2'>
                                                <img
                                                    className='rounded-full w-8 h-8 min-w-8 object-cover'
                                                    src={driver.avatar}
                                                    alt='Avatar'
                                                />
                                                {`${driver.lastName} ${driver.firstName}`}
                                            </div>
                                        </td>
                                        <td className='table-item w-41'>{driver.licensePlate}</td>
                                        <td className='table-item w-43'>{driver.idDriver}</td>
                                        <td className='table-item w-38'>{driver.phone}</td>
                                        <td className='table-item w-39'>{driver.dateOfBirth}</td>
                                        <td className='table-item w-46'>{driver.zone}</td>
                                        <td className='table-item text-center w-25'>
                                            <span
                                                className={
                                                    (driver.admin
                                                        ? 'text-red-500 bg-red-100'
                                                        : 'text-gray-500 bg-gray-100') + ' p-0.5 rounded-sm'
                                                }
                                            >
                                                {t(driver.admin ? 'Admin' : 'Driver')}
                                            </span>
                                        </td>
                                        <td className='table-item w-37'>
                                            <div className='flex justify-evenly gap-4'>
                                                <Button
                                                    className={!isAdmin ? variants.notAllowedBtn : variants.textBtn}
                                                    onClick={
                                                        isAdmin
                                                            ? () => handleRestore(driver.idDriver)
                                                            : () =>
                                                                  dispatch(
                                                                      addToast({
                                                                          title: 'Warning',
                                                                          message:
                                                                              'Only admins are allowed to perform this action',
                                                                          type: 'warning',
                                                                      }),
                                                                  )
                                                    }
                                                >
                                                    {t('Restore')}
                                                </Button>
                                                <Button
                                                    className={!isAdmin ? variants.notAllowedBtn : variants.deleteBtn}
                                                    onClick={
                                                        isAdmin
                                                            ? () => handleClickDeleteButton(driver.idDriver)
                                                            : () =>
                                                                  dispatch(
                                                                      addToast({
                                                                          title: 'Warning',
                                                                          message:
                                                                              'Only admins are allowed to perform this action',
                                                                          type: 'warning',
                                                                      }),
                                                                  )
                                                    }
                                                >
                                                    {t('Delete')}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isLoading && <Spinner />}

            {isRestoreSuccessModal && (
                <Modal
                    icon={<TickIconCustom />}
                    color='var(--color-success)'
                    message='The driver has been restored!'
                    description="The driver has been restored. Click 'Confirm' to continue editing!"
                    primaryActionLabel='Confirm'
                    onPrimaryAction={handleCloseModal}
                />
            )}

            {isRestoreFailureModal && (
                <Modal
                    icon={<CloseIcon />}
                    color='var(--color-failure)'
                    message='Failed to restore this driver!'
                    description={errorMessage}
                    primaryActionLabel='Confirm'
                    onPrimaryAction={handleCloseModal}
                />
            )}

            {isConfirmDeleteModal && (
                <Modal
                    icon={<WarningIcon className='h-[40px]!' />}
                    color='var(--color-warning)'
                    message={t('Delete Driver?')}
                    description={t(
                        'This action will permanently remove the driver from the system. Are you sure you want to proceed?',
                    )}
                    primaryActionLabel={t('Delete')}
                    onPrimaryAction={handleDelete}
                    secondaryActionLabel={t('Cancel')}
                    onSecondaryAction={handleCloseModal}
                />
            )}

            {isDeleteSuccessModal && (
                <Modal
                    icon={<TickIconCustom />}
                    color='var(--color-success)'
                    message={t('The driver has been deleted!')}
                    description={t("Click 'Confirm' to return to the driver list.")}
                    primaryActionLabel={t('Confirm')}
                    onPrimaryAction={handleCloseModal}
                />
            )}

            {isDeleteFailureModal && (
                <Modal
                    icon={<CloseIcon />}
                    color='var(--color-failure)'
                    message={t('Failed to restore this driver!')}
                    description={errorMessage}
                    primaryActionLabel={t('Confirm')}
                    onPrimaryAction={handleCloseModal}
                />
            )}
        </>
    );
}

export default Trash;
