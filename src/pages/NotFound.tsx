import Player from "lottie-react";
import animationData from "../assets/404.json";

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800">
      <Player
        autoplay
        loop
        animationData={animationData}
        style={{ height: 400, width: 600 }}
      />
      <h2 className="text-3xl font-bold mb-2 text-baloonBlue">Oops! We can't find that page</h2>
      <p className="text-lg text-center max-w-lg mb-6 text-gray-200">
        The page you are looking for does not exist. Click the button below to
        go back to the homepage.
      </p>
      <a
        href="/"
        className="relative overflow-hidden bg-transparent border-4 border-baloonBlue text-gray-200 font-bold py-2 px-8 rounded-full cursor-pointer transition-all duration-200 ease-in-out hover:text-gray-300"
      >
        HOME
      </a>
    </div>
  );
};
