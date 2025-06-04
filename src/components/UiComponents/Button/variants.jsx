const varirants = {
    primaryBtn: 'button',
    textBtn:
        'relative z-1 rounded-sm  px-3 py-2 text-primary bg-transparent border-none transition-all duration-500 ease-in-out cursor-pointer hover:text-white hover:delay-500 before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-primary before:transition-all before:duration-500 before:ease-in-out hover:before:w-[100%] after:absolute after:left-0 after:bottom-0 after:h-0 after:w-full after:bg-primary after:transition-all after:duration-400 after:ease-in-out after:-z-1 hover:after:h-full hover:after:delay-400',

    deleteBtn: 'text-red-500 cursor-pointer',
    cancelBtn: 'text-base px-6 py-2 cursor-pointer bg-gray-100 text-gray-800 rounded hover:bg-gray-200',
    notAllowedBtn: 'cursor-not-allowed! opacity-50',
};

export default varirants;
