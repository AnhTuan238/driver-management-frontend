import { NavLink } from 'react-router-dom';

import Sidebar from '~/components/LayoutComponents/Sidebar';
import Navbar from '~/components/LayoutComponents/Navbar';
import Footer from '~/components/LayoutComponents/Footer';

function SidebarLayout({ children }) {
    return (
        <>
            <div className='max-w-screen overflow-x-hidden'>
                <Navbar />
            </div>
            <div className='grid min-h-dvh grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] lg:grid-cols-[var(--container-2xs)_2.5rem_minmax(0,1fr)_2.5rem] pt-14 xl:grid-cols-[var(--container-3xs)_1.5rem_minmax(0,1fr)_1.5rem]'>
                <Sidebar />
                <div className='col-start-2 row-span-5 row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 max-lg:hidden dark:[--pattern-fg:var(--color-white)]/10 dark:bg-background-dark'></div>
                <div className='bg-custom dark:bg-none! dark:bg-background-dark'>{children}</div>
                <div className='col-start-4 row-span-5 row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 max-lg:hidden dark:[--pattern-fg:var(--color-white)]/10 dark:bg-background-dark'></div>
                <div className='row-start-3 lg:col-start-3'>
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default SidebarLayout;
