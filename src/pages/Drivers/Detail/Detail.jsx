import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import {
    IdIcon,
    AddressIcon,
    VehicleIcon,
    ProfileIcon,
    OverviewIcon,
    TimeIcon,
} from '~/components/UiComponents/Icon/Icon';
import Spinner from '~/components/UiComponents/Spinner';
import Chart from '~/components/UiComponents/Chart';
import { getDetailDriver } from '~/api/driver';
import formatDate from '~/utils/formatDate';

function Detail() {
    const [driver, setDriver] = useState(null);
    const [tab, setTab] = useState('timestamps');
    const { t } = useTranslation();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDetailDriver(id);
                setDriver(response);
            } catch (error) {
                console.log('API call failed: ', error);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [id]);

    return (
        <>
            <Helmet>
                <title>{t('Detail - DriveHub')}</title>
            </Helmet>
            {driver ? (
                <div>
                    {/* Introduce */}
                    <div className='px-6 pt-6 pb-3 border-b border-border'>
                        {/* FULL NAME */}
                        <h1 className='mb-4 text-3xl text-black font-bold dark:text-white-dark'>{`${driver.lastName} ${driver.firstName}`}</h1>

                        {/* INFO */}
                        <ul className='flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
                            <li className='detail-intro-info'>
                                <IdIcon className='size-5' />
                                <p>{driver.idDriver}</p>
                            </li>
                            <li className='detail-intro-info'>
                                <AddressIcon className='size-5' />
                                <p>{driver.zone}</p>
                            </li>
                            <li className='detail-intro-info'>
                                <VehicleIcon className='size-5' />
                                <p>{driver.licensePlate}</p>
                            </li>
                        </ul>
                    </div>

                    {/* CHART AND TAB */}
                    <div className='grid grid-cols-1 gap-6 px-6 pt-6 pb-6 xl:grid-cols-3'>
                        {/* CHART */}
                        <div className='xl:col-span-2'>
                            <div className='h-[375px] w-full rounded-3xl border border-border'>
                                <Chart
                                    data={driver.healthData.map((item) => ({
                                        pulse: item.pulse,
                                        spo2: item.spo2,
                                        time: formatDate(item.measuredAt),
                                    }))}
                                />
                            </div>
                        </div>

                        {/* DATA DRIVER */}
                        <div className='flex flex-col h-[375px] rounded-3xl border border-border xl:col-span-1'>
                            {/* BUTTON (TAB)*/}
                            <div className='flex items-center justify-around border-b border-border '>
                                <button
                                    className={`tab-title ${tab === 'timestamps' ? 'tab-title-active dark:text-white-dark' : ''}`}
                                    onClick={() => setTab('timestamps')}
                                >
                                    <TimeIcon className='size-5' />
                                    {t('Measurement Log')}
                                </button>
                                <button
                                    className={`tab-title  ${tab === 'profile' ? 'tab-title-active dark:text-white-dark' : ''}`}
                                    onClick={() => setTab('profile')}
                                >
                                    <ProfileIcon className='size-5' />
                                    {t('Profile')}
                                </button>
                            </div>

                            {/* PROFILE */}
                            {tab === 'profile' && (
                                <div className='px-4 h-full'>
                                    <div className='flex flex-col h-full justify-evenly'>
                                        <div className='flex items-center gap-2 col-span-2 border border-border rounded-xl p-2'>
                                            <img
                                                className='rounded-full w-13 h-13 min-w-13 object-cover justify-self-center'
                                                src={driver.avatar}
                                                alt='Avatar'
                                            />
                                            <div className='flex flex-col gap-[2px]'>
                                                <span className='text-[15px] text-black font-bold dark:text-white-dark'>{`${driver.lastName} ${driver.firstName}`}</span>
                                                <span className='text-xs text-gray-400 font-semibold'>
                                                    {driver.idDriver}
                                                </span>
                                                <span className='text-xs text-gray-400'>{`${driver.city}, ${driver.country}`}</span>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-2 gap-4 border border-border rounded-xl p-2'>
                                            <h2 className='col-span-2 font-bold text-[15px] dark:text-white-dark'>
                                                {t('Personal Information')}
                                            </h2>
                                            <div className='flex flex-col gap-1'>
                                                <h3 className='text-xs text-gray-400'>{t('First Name')}</h3>
                                                <span className='text-sm text-black font-semibold dark:text-white-dark'>
                                                    {driver.firstName}
                                                </span>
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <h3 className='text-xs text-gray-400'>{t('Last Name')}</h3>
                                                <span className='text-sm text-black font-semibold dark:text-white-dark'>
                                                    {driver.lastName}
                                                </span>
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <h3 className='text-xs text-gray-400'>{t('Phone Number')}</h3>
                                                <span className='text-sm text-black font-semibold dark:text-white-dark'>
                                                    {driver.phone}
                                                </span>
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <h3 className='text-xs text-gray-400'>{t('Date of Birth')}</h3>
                                                <span className='text-sm text-black font-semibold dark:text-white-dark'>
                                                    {driver.dateOfBirth}
                                                </span>
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <h3 className='text-xs text-gray-400'>{t('Email Address')}</h3>
                                                <span className='text-sm text-black font-semibold dark:text-white-dark'>
                                                    {driver.emailAddress}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* HISTORY */}
                            {tab === 'timestamps' && (
                                <div className='p-4 h-79 overflow-y-scroll scrollbar-hidden'>
                                    {/* TITLE */}
                                    <h2 className='text-base text-black font-bold pb-3 dark:text-white-dark'>
                                        {t('Abnormal data')}
                                    </h2>

                                    {/* DATA */}
                                    <div className=' flex flex-col gap-2'>
                                        {driver.healthData &&
                                        driver.healthData.filter(
                                            (record) => record.pulse > 100 || record.pulse < 60 || record.spo2 < 95,
                                        ).length > 0 ? (
                                            driver.healthData
                                                .filter(
                                                    (record) =>
                                                        record.pulse > 100 || record.pulse < 60 || record.spo2 < 95,
                                                )
                                                .reverse()
                                                .map((record, index) => (
                                                    <div
                                                        key={index}
                                                        className='p-3 rounded-md shadow-md bg-white dark:bg-gray-800'
                                                    >
                                                        {/* TIME */}
                                                        <p className='text-sm text-gray-500 dark:text-gray-300'>
                                                            {formatDate(record.measuredAt)}
                                                        </p>

                                                        {/* PULSE */}
                                                        <p className='text-base text-black dark:text-white'>
                                                            {t('Pulse')}:{' '}
                                                            <span
                                                                className={`font-semibold ${record.pulse > 100 || record.pulse < 60 ? 'text-red-500' : ''}`}
                                                            >
                                                                {record.pulse} bpm
                                                            </span>
                                                        </p>

                                                        {/* SPO2 */}
                                                        <p className='text-base text-black dark:text-white'>
                                                            {t('SpO2')}:{' '}
                                                            <span
                                                                className={`font-semibold ${record.spo2 < 95 ? 'text-red-500' : ''}`}
                                                            >
                                                                {record.spo2} %
                                                            </span>
                                                        </p>
                                                    </div>
                                                ))
                                        ) : (
                                            <p className='text-gray-500 dark:text-gray-400'>
                                                Không có mốc sức khỏe nào đáng chú ý được ghi nhận.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <Spinner />
            )}
        </>
    );
}

export default Detail;
