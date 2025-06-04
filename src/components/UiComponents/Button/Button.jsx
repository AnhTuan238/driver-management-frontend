import { Link } from 'react-router-dom';

function Button({ to, href, children, leftIcon, rightIcon, onClick, className, ...passProps }) {
    let Comp = 'button';
    const props = {
        onClick,
        ...passProps,
    };

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }
    // PRIMARY BUTTON
    if (className !== 'button')
        return (
            <Comp className={className} {...props}>
                {leftIcon && <span>{leftIcon}</span>}
                <span>{children}</span>
                {rightIcon && <span>{rightIcon}</span>}
            </Comp>
        );
    // OTHERS...
    else
        return (
            <Comp className={className} {...props}>
                <div className='button-outer'>
                    <div className='button-inner'>
                        <span>
                            {leftIcon && <span>{leftIcon}</span>}
                            <span>{children}</span>
                            {rightIcon && <span>{rightIcon}</span>}
                        </span>
                    </div>
                </div>
            </Comp>
        );
}

export default Button;
