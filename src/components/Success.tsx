import react from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Success = () => {

    return (
        <div className=' m-auto flex flex-col gap-2 items-center'>
            <DotLottieReact
                src="https://lottie.host/7ce5696e-09bc-47da-bbae-8c7b6db6dbfe/a4Vla8xdmx.lottie"
                loop
                autoplay
                className='-mb-5'
            />
            <h3>Submitted!</h3>
            <p className='text-sm text-gray-500 font-semibold'>Your valuable input is much appreciated.</p>
        </div>
    )
}

export default Success;