import react from 'react'

type ButtonProps = {
    text?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    customStyle?: string
    type?: 'button' | 'submit';
    title?: string;


    children?: React.ReactNode
}

const Button = ({ text, onClick, disabled, customStyle, type, children, title }: ButtonProps) => {

    return (
        <button
            title={title ? title : text ? text : ''}
            className={`flex items-center justify-center gap-2 uppercase font-semibold  ${customStyle} leading-[1.2]`}
            onClick={onClick} disabled={disabled}
            type={type ? type : 'button'}>
            {text} {children}
        </button>
    )
}

export default Button;