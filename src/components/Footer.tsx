import react from 'react'
import Button from './Button';

import { ChevronLeft } from "@deemlol/next-icons";
import { ChevronRight } from "@deemlol/next-icons";

type footerProps = {
    length: number;
    step: number;
    handleStepChange: (t: 'next' | 'back') => void
}

const Footer = ({ length, step, handleStepChange }: footerProps) => {



    return (
        <div className="footer flex gap-8  items-center justify-center ">
            <Button
                customStyle="bg-none text-black font-semibold text-gray-500 p-0"
                onClick={() => {
                    if (step > 0) {
                        handleStepChange('back');
                    }
                }}
                disabled={step <= 0}
                type="button"
            >
                <ChevronLeft size={24} className="mb-0.5" /> Previous
            </Button>
            <div className="text-center text-gray-500">{step + 1} / {length}</div>
            <Button
                customStyle="bg-none text-black font-semibold text-gray-500 p-0"
                onClick={() => {
                    if (step <= length - 1) {
                        handleStepChange('next');
                    }
                }}
                disabled={step >= length - 1}
                type="button"
            >
                Next
                <ChevronRight size={24} className="mb-0.5" />
            </Button>
        </div>
    )
}

export default Footer;