import React from 'react';
import classNames from 'classnames';

type ButtonProps = {
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
};

const Button: React.FC<ButtonProps> = ({
    children,
    size = 'md',
    className = '',
    onClick,
    type = 'button',
}) => {
    const sizeClasses = {
        sm: 'px-3 py-1.5',
        md: 'px-4 py-2',
        lg: 'px-5 py-2.5',
    };

    const baseClasses = 'font-semibold bg-gray-950 text-white rounded-full whitespace-nowrap outline-none duration-200 focus-visible:ring-2 ring-offset-2';

    return (
        <button type={type} onClick={onClick} className={classNames(baseClasses, sizeClasses[size], className)}>
            {children}
        </button>
    );
};

export default Button;
