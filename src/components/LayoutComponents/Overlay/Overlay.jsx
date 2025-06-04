function Overlay({ children, onClick }) {
    return (
        <div
            className='flex items-center justify-center fixed z-999 inset-0 bg-black/50 bg-opacity-50 shadow'
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export default Overlay;
