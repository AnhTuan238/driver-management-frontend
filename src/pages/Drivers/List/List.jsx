import { useDispatch, useSelector } from 'react-redux';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';

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
import { runWithMinDelay } from '~/utils/artificialLatency';
import { loginSuccess } from '~/redux/authenticationSlice';
import Spinner from '~/components/UiComponents/Spinner';
import Modal from '~/components/LayoutComponents/Modal';
import Button from '~/components/UiComponents/Button';
import { createAxios } from '~/createInstance';
import { addToast } from '~/redux/toastSlice';

function List() {
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [isFetchData, setIsFetchData] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalType, setModalType] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const driver = useSelector((state) => state.authentication.login?.currentDriver);
    const isAdmin = driver?.admin;
    let axiosJWT = createAxios(driver, dispatch, loginSuccess);
    const [rowData, setRowData] = useState([]);
    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            flex: 1,
        };
    }, []);
    const columnDefsSkeleton = [
        {
            valueGetter: (p) => p.node.rowIndex + 1,
            headerName: '#',
            filter: false,
            flex: 0.5,
            headerClass: 'custom-center-header',
            cellStyle: { textAlign: 'center' },
        },
        {
            cellRenderer: (params) => (
                <div className='flex items-center justify-center'>
                    {params.data.avatar && (
                        <img src={params.data.avatar} alt='Avatar' className='w-8 h-8 rounded-full' />
                    )}
                </div>
            ),
            headerName: 'Avatar',
            filter: false,
            flex: 0.5,
            cellStyle: { alignContent: 'center' },
        },
        {
            headerName: 'Last Name',
            flex: 0.8,
            cellRenderer: () => <Skeleton width={50} height={15} />,
        },
        { headerName: 'First Name', cellRenderer: () => <Skeleton width={100} height={15} /> },
        { headerName: 'License Plate', cellRenderer: () => <Skeleton width={90} height={15} /> },
        { headerName: 'Mobile', cellRenderer: () => <Skeleton width={90} height={15} /> },
        { headerName: 'Date of Birth', cellRenderer: () => <Skeleton width={80} height={15} /> },
        { headerName: 'Zone', cellRenderer: () => <Skeleton width={100} height={15} /> },
        {
            cellRenderer: () => <Skeleton width={50} height={15} />,
            headerName: 'Role',
            flex: 0.7,
        },
        {
            headerName: '',
            field: 'idDriver',
            cellRenderer: () => {
                return (
                    <div className='flex justify-evenly gap-4'>
                        <Button className={!isAdmin ? variants.notAllowedBtn : 'text-primary cursor-pointer'}>
                            Edit
                        </Button>
                        <Button className={!isAdmin ? variants.notAllowedBtn : 'text-red-500'}>
                            <TrashIcon className='size-5' />
                        </Button>
                    </div>
                );
            },

            filter: false,
        },
    ];
    const [columnDefs] = useState([
        {
            valueGetter: (p) => p.node.rowIndex + 1,
            headerName: '#',
            filter: false,
            flex: 0.5,
            headerClass: 'custom-center-header',
            cellStyle: { textAlign: 'center' },
        },
        {
            cellRenderer: (params) => (
                <div className='flex items-center justify-center'>
                    {params.data.avatar && (
                        <img src={params.data.avatar} alt='Avatar' className='w-8 h-8 rounded-full' />
                    )}
                </div>
            ),
            headerName: t('Avatar'),
            filter: false,
            flex: 0.5,
            cellStyle: { alignContent: 'center' },
        },
        {
            field: 'lastName',
            headerName: t('Last Name'),
            flex: 0.8,
        },
        { field: 'firstName', headerName: t('First Name') },
        { field: 'licensePlate', headerName: t('License Plate') },
        { field: 'phone', headerName: t('Mobile') },
        { field: 'dateOfBirth', headerName: t('Date of Birth') },
        { field: 'zone', headerName: t('Zone') },
        {
            cellRenderer: (params) => (
                <span
                    className={`${
                        params.data.admin ? 'text-red-500 bg-red-100' : 'text-gray-500 bg-gray-100'
                    } p-0.5 rounded-sm`}
                >
                    {params.data.admin ? 'Admin' : 'Driver'}
                </span>
            ),
            headerName: t('Role'),
            flex: 0.7,
        },
        {
            headerName: '',
            field: 'idDriver',
            cellRenderer: (params) => {
                return (
                    <div className='flex justify-evenly gap-4'>
                        <Button
                            className={!isAdmin ? variants.notAllowedBtn : 'text-primary cursor-pointer'}
                            onClick={
                                isAdmin
                                    ? () => handleClickEditButton(params.data.idDriver)
                                    : () =>
                                          dispatch(
                                              addToast({
                                                  title: 'Warning',
                                                  message: 'Only administrators are allowed to perform this action',
                                                  type: 'warning',
                                              }),
                                          )
                            }
                        >
                            Edit
                        </Button>
                        <Button
                            className={!isAdmin ? variants.notAllowedBtn : 'text-red-500'}
                            onClick={
                                isAdmin
                                    ? () => handleClickTrashButton(params.data.idDriver)
                                    : () =>
                                          dispatch(
                                              addToast({
                                                  title: 'Warning',
                                                  message: 'Only administrators are allowed to perform this action',
                                                  type: 'warning',
                                              }),
                                          )
                            }
                        >
                            <TrashIcon className='size-5' />
                        </Button>
                    </div>
                );
            },
            filter: false,
        },
    ]);

    useEffect(() => {
        let timeout;

        const fetchDrivers = async () => {
            try {
                const response = await getAllDrivers();
                setRowData(response);
            } catch (error) {
                console.error('API call failed:', error);
            } finally {
                timeout = setTimeout(() => {
                    setIsFetchData(false);
                }, 800);
            }
        };

        fetchDrivers();

        return () => clearTimeout(timeout);
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
            await runWithMinDelay(() => softDeleteDriver(selectedDriverId, driver?.accessToken, axiosJWT), 500);
            setRowData((prevDrivers) => prevDrivers.filter((driver) => driver.idDriver !== selectedDriverId));
            setModalType('moveTrashSuccess');
            setSelectedDriverId(null);
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || 'Something went wrong. Please try again in a few seconds!';
            setErrorMessage(errorMessage);
            setModalType('moveTrashFailed');
            console.error('API call failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalType(null);
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
                            {isFetchData ? <Skeleton circle height='100%' width='15px' /> : rowData.length}
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
                        <span>
                            {isFetchData ? (
                                <Skeleton height={20} width='20%' />
                            ) : (
                                rowData.filter((driver) => driver.admin).length
                            )}
                        </span>
                    </div>
                </div>

                {/* DRIVER */}
                <div className='overview-item'>
                    <div>
                        <UserGroupIcon />
                        <p>{t('Driver')}</p>
                    </div>
                    <div>
                        <span>
                            {isFetchData ? (
                                <Skeleton height={20} width='20%' />
                            ) : (
                                rowData.filter((driver) => !driver.admin).length
                            )}
                        </span>
                    </div>
                </div>

                {/* BUSY */}
                <div className='overview-item'>
                    <div>
                        <BusyIcon />
                        <p>{t('Busy')}</p>
                    </div>
                    <div>
                        <span>
                            {isFetchData ? (
                                <Skeleton height={20} width='20%' />
                            ) : (
                                rowData.filter((driver) => driver.status === 'Busy').length
                            )}
                        </span>
                    </div>
                </div>

                {/* OFFLINE */}
                <div className='overview-item'>
                    <div>
                        <OfflineIcon />
                        <p>{t('Offline')}</p>
                    </div>
                    <div>
                        <span>
                            {isFetchData ? (
                                <Skeleton height={20} width='20%' />
                            ) : (
                                rowData.filter((driver) => driver.status === 'Offline').length
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            {isFetchData ? (
                <div style={{ height: 350 }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefsSkeleton}
                        pagination={true}
                        paginationPageSize={10}
                        theme={themeQuartz}
                        defaultColDef={defaultColDef}
                    />
                </div>
            ) : (
                <div style={{ height: 350 }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        pagination={true}
                        paginationPageSize={10}
                        theme={themeQuartz}
                        defaultColDef={defaultColDef}
                    />
                </div>
            )}

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
