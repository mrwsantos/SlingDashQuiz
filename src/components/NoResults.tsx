import react from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const NoResults = () => {

    return (

        <div className="p-5 text-center max-w-md">
            <DotLottieReact
                src="https://lottie.host/08864e37-bfe9-40d9-8723-e94753d5c1f2/BDUSHwzIrM.lottie"
                loop
                autoplay
                onError={() => {
                    console.error('❌ Failed to load Lottie animation');
                }}
                className="mx-auto mb-6"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Results Found</h2>
            <p className="text-gray-600">
                Sorry, we couldn’t find any data to display right now.
                <br />
                Please check back again later.
            </p>
        </div>
    )
}

export default NoResults;