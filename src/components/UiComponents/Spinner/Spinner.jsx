import Overlay from '~/components/LayoutComponents/Overlay';

function ThreeDotLoader() {
    return (
        <Overlay>
            <div className='three-body'>
                <div className='three-body__dot'></div>
                <div className='three-body__dot'></div>
                <div className='three-body__dot'></div>
            </div>
        </Overlay>
    );
}

export default ThreeDotLoader;
