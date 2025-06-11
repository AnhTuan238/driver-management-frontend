import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';

import { getAllDriversInTrash, restoreDriver, forceDeleteDriver } from '~/api/driver';
import { ArrowBack, WarningIcon, CloseIcon, TickIconCustom } from '~/components/UiComponents/Icon';
import variants from '~/components/UiComponents/Button/variants';
import { loginSuccess } from '~/redux/authenticationSlice';
import Spinner from '~/components/UiComponents/Spinner';
import Modal from '~/components/LayoutComponents/Modal';
import Button from '~/components/UiComponents/Button';
import { createAxios } from '~/createInstance';
import { addToast } from '~/redux/toastSlice';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';

function Trash() {
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [originalDrivers, setOriginalDrivers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isFetchData, setIsFetchData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [filters, setFilters] = useState({
        date: '',
        zone: '',
        role: '',
    });
    const { t } = useTranslation();
    const dispatch = useDispatch();
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
                            {t('Restore')}
                        </Button>
                        <Button className={!isAdmin ? variants.notAllowedBtn : 'text-red-500'}>{t('Delete')}</Button>
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
                                    ? () => handleRestore(params.data.idDriver)
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
                            {t('Restore')}
                        </Button>
                        <Button
                            className={!isAdmin ? variants.notAllowedBtn : 'text-red-500'}
                            onClick={
                                isAdmin
                                    ? () => handleClickDeleteButton(params.data.idDriver)
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
                            {t('Delete')}
                        </Button>
                    </div>
                );
            },
            filter: false,
        },
    ]);

    useEffect(() => {
        let timeout;

        const fetchDriversInTrash = async () => {
            try {
                const response = await getAllDriversInTrash();
                setRowData(response);
            } catch (error) {
                console.error('API call failed:', error);
            } finally {
                timeout = setTimeout(() => {
                    setIsFetchData(false);
                }, 800);
            }
        };

        fetchDriversInTrash();

        return () => clearTimeout(timeout);
    }, []);

    const handleRestore = async (id) => {
        setIsLoading(true);
        try {
            await restoreDriver(id, driver?.accessToken, axiosJWT);
            setTimeout(() => {
                setIsLoading(false);
                setRowData((prevDrivers) => prevDrivers.filter((driver) => driver.idDriver !== id));
                setModalType('restoreSuccess');
                setSelectedDriverId(null);
            }, 800);
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || 'Something went wrong. Please try again in a few seconds!';
            setErrorMessage(errorMessage);
            setIsLoading(false);
            setModalType('restoreFailed');
            console.error('API call failed: ', error);
        }
    };

    const handleClickDeleteButton = (id) => {
        setModalType('confirmDelete');
        setSelectedDriverId(id);
    };

    const handleDelete = async () => {
        setModalType(null);
        setIsLoading(true);

        try {
            await forceDeleteDriver(selectedDriverId, driver?.accessToken, axiosJWT);
            setTimeout(() => {
                setIsLoading(false);
                setRowData((prevDrivers) => prevDrivers.filter((driver) => driver.idDriver !== selectedDriverId));

                setModalType('deleteSuccess');
                setSelectedDriverId(null);
            }, 800);
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || 'Something went wrong. Please try again in a few seconds!';
            setErrorMessage(errorMessage);
            setIsLoading(false);
            setModalType('deleteFailed');
            console.error('API call failed: ', error);
        }
    };

    const handleCloseModal = () => {
        setModalType(null);
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
                            {isFetchData ? <Skeleton circle height='100%' width='15px' /> : originalDrivers.length}
                        </span>
                    </div>
                    <p className='text-text text-sm! dark:text-white-dark'>{t('Manage your drivers')}</p>
                </div>
                <Button className={variants.primaryBtn} to='/drivers/list' leftIcon={<ArrowBack className='size-5' />}>
                    {t('Back to Drivers')}
                </Button>
            </div>

            {/* TABLE */}
            {isFetchData ? (
                <div style={{ height: 350 }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefsSkeleton}
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
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
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        theme={themeQuartz}
                        defaultColDef={defaultColDef}
                    />
                </div>
            )}

            {isLoading && <Spinner />}

            {modalType === 'restoreSuccess' && (
                <Modal
                    icon={<TickIconCustom />}
                    color='var(--color-success)'
                    message={t('The driver has been restored.')}
                    description={t("Click 'Confirm' to continue editing.")}
                    primaryActionLabel={t('Confirm')}
                    onPrimaryAction={handleCloseModal}
                />
            )}

            {modalType === 'restoreFailed' && (
                <Modal
                    icon={<CloseIcon />}
                    color='var(--color-failure)'
                    message={t('Failed to restore this driver.')}
                    description={errorMessage}
                    primaryActionLabel='Confirm'
                    onPrimaryAction={handleCloseModal}
                />
            )}

            {modalType === 'confirmDelete' && (
                <Modal
                    icon={<WarningIcon className='h-[40px]!' />}
                    color='var(--color-warning)'
                    message={t('Permanently delete this driver?')}
                    description={t(
                        'This action will permanently remove the driver from the system. Are you sure you want to proceed?',
                    )}
                    primaryActionLabel={t('Delete')}
                    onPrimaryAction={handleDelete}
                    secondaryActionLabel={t('Cancel')}
                    onSecondaryAction={handleCloseModal}
                />
            )}

            {modalType === 'deleteSuccess' && (
                <Modal
                    icon={<TickIconCustom />}
                    color='var(--color-success)'
                    message={t('The driver has been deleted.')}
                    description={t("Click 'Confirm' to continue editing.")}
                    primaryActionLabel={t('Confirm')}
                    onPrimaryAction={handleCloseModal}
                />
            )}

            {modalType === 'deleteFailed' && (
                <Modal
                    icon={<CloseIcon />}
                    color='var(--color-failure)'
                    message={t('Failed to delete this driver.')}
                    description={errorMessage}
                    primaryActionLabel={t('Confirm')}
                    onPrimaryAction={handleCloseModal}
                />
            )}
        </>
    );
}

export default Trash;
