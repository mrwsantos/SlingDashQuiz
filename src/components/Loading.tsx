import react from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading = () => {

    return (
        <div className='m-auto flex flex-col gap-2 items-center'>
            <DotLottieReact
                src="https://lottie.host/7633aeab-cf65-4691-a736-795a10f17d36/R5u3X3YNaY.lottie"
                loop
                autoplay
                className='-mb-5 -mt-30'
            />
            <span className='text-sm text-gray-500 font-semibold fade-to'>LOADING...</span>
        </div>
    )
}

export default Loading;