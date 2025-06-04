import React from 'react';

type InputProps = {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (val: string) => void;
    type?: string;
    multiline?: boolean;
    className?: string;
};

const Input = ({
    label,
    placeholder = '',
    value,
    onChange,
    type = 'text',
    multiline = false,
    className = '',
}: InputProps) => {
    return (
        <label className="flex flex-col justify-center items-center w-[95%] max-w-2xl m-auto gap-4">
            {label && (
                <span className="text-xl text-center leading-[1.4]">{label}</span>
            )}
            {multiline ? (
                <textarea
                    className={`p-4 min-h-40 w-full bg-gray-100 rounded-lg placeholder:text-gray-800 ${className}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input
                    type={type}
                    className={`p-4 w-full bg-gray-100 rounded-lg placeholder:text-gray-800 ${className}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </label>
    );
};

export default Input;
