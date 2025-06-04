import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import {
    AddressIcon,
    MobileIcon,
    MailIcon,
    ArrowDown,
    ArrowUp,
    IdIcon,
    VehicleIcon,
} from '~/components/UiComponents/Icon/Icon';
import variants from '~/components/UiComponents/Button/variants';
import Button from '~/components/UiComponents/Button';
import Pulse from '~/components/UiComponents/Pulse';
import Spo2 from '~/components/UiComponents/Spo2';
import { getAllDrivers } from '~/api/driver';
import formatDate from '~/utils/formatDate';

function Overview() {
    const [drivers, setDrivers] = useState([]);
    const { t } = useTranslation();
    const [expandedDrivers, setExpandedDrivers] = useState([]);

    const handleExpand = (id) => {
        setExpandedDrivers((prev) => (prev.includes(id) ? prev.filter((driverId) => driverId !== id) : [...prev, id]));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllDrivers();
                setDrivers(response);
            } catch (error) {
                console.error('API call failed: ', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Helmet>
                <title>{t('Overview - DriveHub')}</title>
            </Helmet>
            <h1 className='heading'>{t('DRIVEHUB')}</h1>
            {drivers.map((driver, index) => {
                const lastHealth = driver.healthData.at(-1);
                const isPulseDataAbnormal = lastHealth.pulse < 60 || lastHealth.pulse > 100;
                const isSpO2DataAbnormal = lastHealth.spo2 < 95;
                const isAlert = driver.status === 'Busy' ? isPulseDataAbnormal || isSpO2DataAbnormal : false;

                return (
                    <div
                        key={index}
                        className={`w-full mb-4 border rounded-xl p-2 transition-all duration-500 
                ${isAlert ? 'border-red-500 blink-red-border' : 'border-border'}`}
                    >
                        <div className='flex items-center gap-2 pb-2 border-b border-border'>
                            <img
                                className='rounded-full w-11 h-11 min-w-11 object-cover'
                                src={`${import.meta.env.VITE_BASE_URL}/public/images/${driver.avatar}`}
                                alt='Avatar'
                            />
                            <div className='basis-full flex flex-col justify-between h-11'>
                                <span className='text-text text-base font-bold leading-[100%] dark:text-white-dark'>{`${driver.lastName} ${driver.firstName} `}</span>
                                <div className=' w-fit text-xs font-semibold'>
                                    {driver.admin ? (
                                        <span className='inline-flex p-1 inline-flex bg-red-200 text-red-500 leading-none rounded-sm'>
                                            {t('Admin')}
                                        </span>
                                    ) : (
                                        <span className='inline-flex p-1 inline-flex bg-gray-200 text-gray-500 leading-none rounded-sm'>
                                            {t('Driver')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className='text-sm font-bold flex items-center whitespace-nowrap dark:text-white-dark'>
                                    {t('Status')}:&nbsp;
                                    <span
                                        className={
                                            (driver.status === 'Busy'
                                                ? 'text-red-500 bg-red-100'
                                                : 'text-gray-500 bg-gray-100') + ' p-1 rounded-sm font-semibold'
                                        }
                                    >
                                        {' '}
                                        {t(driver.status)}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center flex-col sm:flex-row gap-4 '>
                            <div className='flex items-center w-full md:justify-start gap-4 flex-wrap'>
                                <div className='hidden lg:flex lg:flex-col items-center gap-2 py-2 pl-4 pr-8 relative after:absolute after:inset-y-0 after:right-0 after:h-11 after:top-[50%] after:translate-y-[-50%] after:w-px after:bg-gray-300'>
                                    <h3 className='text-sm text-gray-400'>{t('Date Added')}</h3>
                                    <div className='flex items-center'>
                                        <span className='text-black dark:text-white-dark font-semibold'>
                                            {formatDate(driver.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className=' items-start w-full after:bg-transparent sm:w-fit flex flex-col sm:items-center gap-2 py-2 pl-4 pr-8 relative after:absolute after:inset-y-0 after:right-0 after:h-11 after:top-[50%] after:translate-y-[-50%] after:w-px sm:after:bg-gray-300'>
                                    <h3 className='text-sm text-gray-400'>{t('Last Updated')}</h3>
                                    <div className='flex items-center'>
                                        <span className='text-black dark:text-white-dark font-semibold'>
                                            {formatDate(
                                                driver.healthData.at(-1).measuredAt < driver.createdAt
                                                    ? driver.createdAt
                                                    : driver.healthData.at(-1).measuredAt,
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className='items-start flex w-full sm:items-center sm:w-fit'>
                                    <div className='flex flex-col sm:items-center after:bg-transparent gap-2 py-2 pl-4 pr-8 relative after:absolute after:inset-y-0 after:right-0 after:h-11 after:top-[50%] after:translate-y-[-50%] after:w-px sm:after:bg-gray-300'>
                                        <h3 className='text-sm text-gray-400'>{t('SpO2')}</h3>
                                        <div className='flex items-center'>
                                            <Spo2 />
                                            &nbsp;
                                            <span>:</span>&nbsp;
                                            <span
                                                className={`font-semibold ${isSpO2DataAbnormal ? 'text-red-500 dark:text-red-500' : 'text-black dark:text-white-dark'}`}
                                            >
                                                {driver.healthData.at(-1).spo2 ? (
                                                    driver.healthData.at(-1).spo2
                                                ) : (
                                                    <span className='text-gray-400'>No data available</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='flex flex-col sm:items-center gap-2 px-4 py-2'>
                                        <h3 className='text-sm text-gray-400'>{t('Pulse')}</h3>
                                        <div className='flex items-center'>
                                            <Pulse />
                                            &nbsp;
                                            <span>:</span>&nbsp;
                                            <span
                                                className={`font-semibold ${isPulseDataAbnormal ? 'text-red-500 dark:text-red-500' : 'text-black dark:text-white-dark'}`}
                                            >
                                                {driver.healthData.at(-1).pulse ? (
                                                    driver.healthData.at(-1).pulse
                                                ) : (
                                                    <span className='text-gray-400'>No data available</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button
                                className={`${variants.textBtn} self-end text-base whitespace-nowrap`}
                                to={`/drivers/${driver.idDriver}`}
                            >
                                {t('View detail')}
                            </Button>
                        </div>
                        <div className='cursor-pointer border-border border-t pt-2'>
                            <div
                                className='flex gap-2 items-center justify-center'
                                onClick={() => handleExpand(driver.idDriver)}
                            >
                                <span className='text-base text-black font-semibold'>{t('View More')}</span>
                                {expandedDrivers.includes(driver.idDriver) ? (
                                    <ArrowUp className='flex items-center size-5 p-0.5 bg-primary text-white rounded-full' />
                                ) : (
                                    <ArrowDown className='flex items-center size-5 p-0.5 bg-gray-200 rounded-full' />
                                )}
                            </div>
                        </div>
                        {expandedDrivers.includes(driver.idDriver) && (
                            <div className='flex flex-start flex-col gap-2 items-start pt-2 text-sm sm:flex-row sm:justify-between'>
                                <div className='flex items-center justify-center gap-1 basis-full bg-gray-200 py-2 rounded-l-3xl'>
                                    <IdIcon className='size-4 text-primary' />
                                    <p className='text-gray-400'>{driver.idDriver}</p>
                                </div>
                                <div className='flex items-center justify-center gap-1 basis-full bg-gray-200 py-2'>
                                    <MobileIcon className='size-4 text-primary' />
                                    <p className='text-gray-400'>{driver.phone}</p>
                                </div>

                                <div className='flex items-center justify-center gap-1 basis-full bg-gray-200 py-2'>
                                    <AddressIcon className='size-4 text-primary' />
                                    <p className='text-gray-400'>{driver.zone}</p>
                                </div>
                                <div className='lg:flex items-center justify-center gap-1 hidden basis-full bg-gray-200 py-2 '>
                                    <MailIcon className='size-4 text-primary' />
                                    <p className='text-gray-400'>{driver.emailAddress}</p>
                                </div>
                                <div className='lg:flex items-center justify-center gap-1 hidden basis-full bg-gray-200 py-2 rounded-r-3xl'>
                                    <VehicleIcon className='size-4 text-primary' />
                                    <p className='text-gray-400'>{driver.licensePlate}</p>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
}

export default Overview;
