import variants from '~/components/UiComponents/Button/variants';
import Overlay from '~/components/LayoutComponents/Overlay';
import Button from '~/components/UiComponents/Button';

function Modal({
    icon = null,
    message = '',
    description = '',
    color = null,
    primaryActionLabel = null,
    secondaryActionLabel = null,
    customClassName = '',
    children = null,
    onPrimaryAction = () => {},
    onSecondaryAction = () => {},
    onClose = () => {},
}) {
    return (
        <Overlay onClick={onClose}>
            <div
                className={
                    'w-full max-w-sm px-6 py-10 text-center bg-white rounded-lg shadow-lg md:max-w-md dark:bg-background-dark' +
                    ' ' +
                    customClassName
                }
                role='dialog'
                aria-modal='true'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex flex-col items-center'>
                    {/* ICON */}
                    {icon && (
                        <div
                            className={`flex items-center justify-center p-3 text-white mb-8 h-18 w-18 border border-solid rounded-full`}
                            style={{ background: color }}
                        >
                            {icon}
                        </div>
                    )}

                    {/* MESSAGE */}
                    {message ? <p className='mb-4 text-lg font-semibold dark:text-white-dark'>{message}</p> : null}

                    {/* DESCRIPTION */}
                    {description ? (
                        <p className='mb-8 text-text text-[15px] text-justify dark:text-white-dark'>{description}</p>
                    ) : null}
                </div>

                {/* BUTTON */}
                <div className='flex justify-end gap-4'>
                    {/* SECONDARY BUTTON */}
                    {secondaryActionLabel ? (
                        <Button className={variants.textBtn} onClick={onSecondaryAction}>
                            {secondaryActionLabel}
                        </Button>
                    ) : null}

                    {/* PRIMARY BUTTON */}
                    {primaryActionLabel ? (
                        <Button className={variants.primaryBtn} onClick={onPrimaryAction}>
                            {primaryActionLabel}
                        </Button>
                    ) : null}
                </div>

                {/* OTHERS...*/}
                {children}
            </div>
        </Overlay>
    );
}

export default Modal;
