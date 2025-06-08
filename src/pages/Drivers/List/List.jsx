import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { Helmet } from 'react-helmet';

import {
    UserIcon,
    BusyIcon,
    OfflineIcon,
    UserGroupIcon,
    WarningIcon,
    TrashIcon,
    TickIconCustom,
    CloseIcon,
} from '~/components/UiComponents/Icon';
import variants from '~/components/UiComponents/Button/variants';
import { getAllDrivers, softDeleteDriver } from '~/api/driver';
import { loginSuccess } from '~/redux/authenticationSlice';
import Spinner from '~/components/UiComponents/Spinner';
import Modal from '~/components/LayoutComponents/Modal';
import Button from '~/components/UiComponents/Button';
import { createAxios } from '~/createInstance';
import { addToast } from '~/redux/toastSlice';

function List() {
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [originalDrivers, setOriginalDrivers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [modalType, setModalType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        date: '',
        zone: '',
        role: '',
    });
    const [drivers, setDrivers] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const driver = useSelector((state) => state.authentication.login?.currentDriver);
    const isAdmin = driver?.admin;
    let axiosJWT = createAxios(driver, dispatch, loginSuccess);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await getAllDrivers();
                setDrivers(response);
                setOriginalDrivers(response);
            } catch (error) {
                console.error('API call failed:', error);
            }
        };

        fetchDrivers();
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleClickEditButton = (id) => {
        navigate(`/drivers/${id}/edit`);
    };

    const handleClickTrashButton = (id) => {
        setModalType('confirmMoveToTrash');
        setSelectedDriverId(id);
    };

    const handleMoveToTrash = async () => {
        setModalType(null);
        setIsLoading(true);

        try {
            await softDeleteDriver(selectedDriverId, driver?.accessToken, axiosJWT);
            setTimeout(() => {
                setIsLoading(false);
                setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.idDriver !== selectedDriverId));
                setOriginalDrivers((prevDrivers) =>
                    prevDrivers.filter((driver) => driver.idDriver !== selectedDriverId),
                );
                setModalType('moveTrashSuccess');
                setSelectedDriverId(null);
            }, 800);
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || 'Something went wrong. Please try again in a few seconds.';
            setErrorMessage(errorMessage);
            setIsLoading(false);
            setModalType('moveTrashFailed');
            console.error('API call failed:', error);
        }
    };

    const handleCloseModal = () => {
        setModalType(null);
    };

    if (isLoading) return <Spinner />;

    const handleFilter = () => {
        let filtered = [...originalDrivers];

        if (filters.zone === 'Ha Noi' || filters.zone === 'Ho Chi Minh') {
            filtered = filtered.filter((driver) => driver.zone === filters.zone);
        } else if (filters.zone === 'Others') {
            filtered = filtered.filter((driver) => driver.zone !== 'Ha Noi' && driver.zone !== 'Ho Chi Minh');
        }

        if (filters.role) {
            filtered = filtered.filter((driver) => (filters.role === 'Admin' ? driver.admin : !driver.admin));
        }

        if (filters.date) {
            const now = new Date();
            filtered = filtered.filter((driver) => {
                const addedDate = new Date(driver.createdAt);
                if (filters.date === 'This Month') {
                    return addedDate.getMonth() === now.getMonth() && addedDate.getFullYear() === now.getFullYear();
                }
                if (filters.date === 'This Year') {
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
                <title>{t('List - DriveHub')}</title>
            </Helmet>
            <h1 className='heading'>{t('DRIVERS')}</h1>

            {/* TITLE, BUTTON */}
            <div className='flex items-center justify-between mb-4'>
                <div>
                    <div className='flex items-center gap-2 mb-1'>
                        <h2 className='text-sm font-semibold dark:text-white-dark'>{t('Drivers')}</h2>
                        <span className='flex items-center justify-center p-2.5 w-2 h-2 text-sm text-primary font-bold rounded-full border-2 border-secondary'>
                            {originalDrivers.length}
                        </span>
                    </div>
                    <p className='text-text text-sm dark:text-white-dark'>{t('Manage your drivers')}</p>
                </div>
                <Button className={variants.primaryBtn} to='/drivers/trash' leftIcon={<TrashIcon className='size-6' />}>
                    {t('Trash')}
                </Button>
            </div>

            {/* OVERVIEW */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                {/* ADMIN */}
                <div className='overview-item'>
                    <div>
                        <UserIcon />
                        <p>{t('Admin')}</p>
                    </div>
                    <div>
                        <span>{originalDrivers.filter((driver) => driver.admin).length}</span>
                    </div>
                </div>

                {/* DRIVER */}
                <div className='overview-item'>
                    <div>
                        <UserGroupIcon />
                        <p>{t('Driver')}</p>
                    </div>
                    <div>
                        <span>{originalDrivers.filter((driver) => !driver.admin).length}</span>
                    </div>
                </div>

                {/* BUSY */}
                <div className='overview-item'>
                    <div>
                        <BusyIcon />
                        <p>{t('Busy')}</p>
                    </div>
                    <div>
                        <span>{originalDrivers.filter((driver) => driver.status === 'Busy').length}</span>
                    </div>
                </div>

                {/* OFFLINE */}
                <div className='overview-item'>
                    <div>
                        <OfflineIcon />
                        <p>{t('Offline')}</p>
                    </div>
                    <div>
                        <span>{originalDrivers.filter((driver) => driver.status === 'Offline').length}</span>
                    </div>
                </div>
            </div>

            <div>
                {/* FILTER */}
                <div className='flex flex-wrap items-center justify-between gap-2 py-4 border-t border-border'>
                    {/* Bộ lọc */}
                    <div className='flex flex-wrap items-center gap-2'>
                        <div className='filter-item'>
                            {t('Date added:')}
                            <select
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                className='focus:outline-none w-16 truncate'
                            >
                                <option value=''>{t('All')}</option>
                                <option value='This Month'>{t('This Month')}</option>
                                <option value='This Year'>{t('This Year')}</option>
                            </select>
                        </div>
                        <div className='filter-item'>
                            {t('Zone')}:
                            <select
                                onChange={(e) => setFilters({ ...filters, zone: e.target.value })}
                                className='focus:outline-none w-16 truncate'
                            >
                                <option value=''>{t('All')}</option>
                                <option value='Ha Noi'>Ha Noi</option>
                                <option value='Ho Chi Minh'>{t('Ho Chi Minh')}</option>
                                <option value='Others'>{t('Other places')}</option>
                            </select>
                        </div>
                        <div className='filter-item'>
                            {t('Role')}:
                            <select
                                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
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
                    <table className='min-w-full text-text divide-y divide-gray-200 rounded-lg shadow table-auto'>
                        {/* HEAD */}
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

                        {/* BODY */}
                        <tbody className='bg-white divide-y divide-gray-200 dark:bg-background-dark'>
                            {drivers.length === 0 ? (
                                <tr>
                                    <td className='text-center text-sm font-medium' colSpan='10'>
                                        <div className='mt-4 dark:text-white-dark uppercase'>
                                            {t('No drivers found')} !
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                drivers.map((driver, index) => (
                                    <tr key={index}>
                                        <td className='table-item w-13'>{index + 1}</td>
                                        <td className='table-item gap-1 w-61'>
                                            <div className='flex items-center gap-2 dark:text-white-dark'>
                                                <img
                                                    className='size-8 rounded-full object-cover'
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
                                                    className={
                                                        (!isAdmin ? variants.notAllowedBtn : variants.textBtn) +
                                                        ' px-3 py-2'
                                                    }
                                                    onClick={
                                                        isAdmin
                                                            ? () => handleClickEditButton(driver.idDriver)
                                                            : () =>
                                                                  dispatch(
                                                                      addToast({
                                                                          title: 'Warning',
                                                                          message:
                                                                              'Only administrators are allowed to perform this action',
                                                                          type: 'warning',
                                                                      }),
                                                                  )
                                                    }
                                                >
                                                    {t('Edit')}
                                                </Button>
                                                <Button
                                                    className={
                                                        variants.deleteBtn +
                                                        ' ' +
                                                        (!isAdmin ? variants.notAllowedBtn : '')
                                                    }
                                                    onClick={
                                                        isAdmin
                                                            ? () => handleClickTrashButton(driver.idDriver)
                                                            : () =>
                                                                  dispatch(
                                                                      addToast({
                                                                          title: 'Warning',
                                                                          message:
                                                                              'Only administrators are allowed to perform this action',
                                                                          type: 'warning',
                                                                      }),
                                                                  )
                                                    }
                                                >
                                                    <TrashIcon className='size-5' />
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

            {modalType === 'confirmMoveToTrash' && (
                <Modal
                    icon={<WarningIcon className='h-[40px]!' />}
                    color='var(--color-warning)'
                    message={t('Move driver to Trash?')}
                    description={t(
                        'This driver will be moved to the Trash. You can restore or permanently delete them later.',
                    )}
                    primaryActionLabel={t('Move to trash')}
                    secondaryActionLabel={t('Cancel')}
                    onPrimaryAction={handleMoveToTrash}
                    onSecondaryAction={handleCloseModal}
                />
            )}

            {modalType === 'moveTrashSuccess' && (
                <Modal
                    icon={<TickIconCustom />}
                    color='var(--color-success)'
                    message={t('The driver has been moved to the trash.')}
                    description={t("Click 'Confirm' to return to the driver list page.")}
                    primaryActionLabel={t('Confirm')}
                    onPrimaryAction={handleCloseModal}
                />
            )}

            {modalType === 'moveTrashFailed' && (
                <Modal
                    icon={<CloseIcon />}
                    color='var(--color-failure)'
                    message={t('Failed to moved this driver to the trash.')}
                    description={errorMessage}
                    primaryActionLabel={t('Confirm')}
                    onPrimaryAction={handleCloseModal}
                />
            )}
        </>
    );
}

export default List;
