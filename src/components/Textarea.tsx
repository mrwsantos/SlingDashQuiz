type TextareaProps = {
    text: string;
    value: string;
    onChange: (val: string) => void;
};

const Textarea = ({ text, value, onChange }: TextareaProps) => {
    return (
        <label className='flex flex-col justify-center items-center w-[95%] max-w-2xl m-auto gap-8'>
            <span className='text-3xl text-center leading-[1.4]'>{text}</span>
            <textarea
                className='p-4 min-h-40 w-full bg-gray-100 rounded-lg placeholder:text-gray-800'
                placeholder='Enter your answer here'
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
};

export default Textarea;
