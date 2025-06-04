import DriverList from '~/components/UiComponents/DriverList';

function Sidebar() {
    return (
        <div className='col-start-1 row-span-full row-start-1 hidden relative lg:block dark:bg-background-dark'>
            <div className='absolute inset-0'>
                <div className='fixed top-14 bottom-0 left-0 py-6 h-full max-h-[calc(100dvh-(0.25rem * 14.25))] w-3xs overflow-y-auto'>
                    <DriverList className='flex flex-col' hideAvatar={false} />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
