import react from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Fail = () => {

    return (
        <div className=' mx-auto mt-[15vh]  flex flex-col gap-2 items-center p-5'>
            <DotLottieReact
                src="https://lottie.host/18e2b56e-c2d9-47b6-9116-3162cb009309/eyYvFUPxD8.lottie"
                loop
                autoplay
                className='-mb-5'
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Bad News!</h2>
            <p className='text-sm text-gray-500 font-semibold text-center'>Something went wrong with your submission. We're working to fix it — please try again shortly.</p>
        </div>
    )
}

export default Fail;