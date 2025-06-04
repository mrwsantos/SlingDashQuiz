import react from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Fail = () => {

    return (
        <div className='m-auto flex flex-col gap-4 items-center'>
            <DotLottieReact
                src="https://lottie.host/18e2b56e-c2d9-47b6-9116-3162cb009309/eyYvFUPxD8.lottie"
                loop
                autoplay
                className='-mb-5'
            />
            <h3>Bad News!</h3>
            <p className='text-sm text-gray-500 font-semibold'>Something went wrong with your submission. We're working to fix it — please try again shortly.</p>
        </div>
    )
}

export default Fail;