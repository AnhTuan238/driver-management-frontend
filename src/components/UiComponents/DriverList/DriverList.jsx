import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { getAllDrivers } from '~/api/driver';

function DriverList({ className, hideAvatar, onClick }) {
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await getAllDrivers();
                setDrivers(response);
            } catch (error) {
                console.error('API call failed:', error);
            }
        };

        fetchDrivers();
    }, []);

    return (
        <ul className={className}>
            {drivers.map((driver, index) => (
                <li className='hover:bg-hover dark:hover:bg-hover-dark' key={index}>
                    <NavLink
                        className='flex items-center gap-2 px-6 py-3 text-[15px] text-text sidebar-item lg:px-6 lg:py-2 dark:text-[#F6F7F9] dark:font-semibold'
                        to={`/drivers/${driver.idDriver}`}
                        onClick={onClick}
                    >
                        <img
                            className={hideAvatar ? 'hidden' : 'w-8 h-8 min-w-8 rounded-full object-cover'}
                            src={driver.avatar}
                            alt='Avatar'
                        />
                        {`${driver.lastName} ${driver.firstName}`}
                    </NavLink>
                </li>
            ))}
        </ul>
    );
}

export default DriverList;
