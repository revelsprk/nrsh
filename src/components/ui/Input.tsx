import React from 'react';

type InputProps = {
    icon?: React.ReactNode;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    type?: string;
};

const Input: React.FC<InputProps> = ({
    icon,
    placeholder = '',
    value,
    onChange,
    className = '',
    type = 'text',
}) => {
    return (
        <div className={`flex items-center border rounded-md shadow-sm h-10 overflow-hidden px-4 bg-white ${className}`}>
            {icon && <div className="text-gray-400 mr-2">{icon}</div>}
            <input
                type={type}
                className="outline-none bg-transparent h-10 w-full"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default Input;