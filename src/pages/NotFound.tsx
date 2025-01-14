import Player from 'lottie-react';
import animationData from '../assets/404.json';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 text-blue-900">
            <Player
                autoplay
                loop
                animationData={animationData}
                style={{ height: 400, width: 600 }}
            />
            <h2 className="text-3xl font-bold mb-2">Oops! We can't find that page</h2>
            <p className="text-lg text-center max-w-lg mb-6">
            The page you are looking for does not exist. Click the button below to go back to the homepage.
            </p>
            <button className="btn-green" onClick={() => navigate("/")}>HOME</button>
        </div>
)   ;
};
