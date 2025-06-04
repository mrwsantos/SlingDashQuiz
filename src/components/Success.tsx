import react from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Success = () => {

    return (
        <div className=' mx-auto mt-[15vh]  flex flex-col gap-2 items-center p-5'>
            <DotLottieReact
                src="https://lottie.host/7ce5696e-09bc-47da-bbae-8c7b6db6dbfe/a4Vla8xdmx.lottie"
                loop
                autoplay
                className='-mb-5'
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Submitted!</h2>
            <p className='text-sm text-center text-gray-500 font-semibold'>Your valuable input is much appreciated.</p>
        </div>
    )
}

export default Success;