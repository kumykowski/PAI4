import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/Home";
import { NotFoundPage } from "../pages/NotFound";
import { WeatherPage } from "../pages/Weather";
import { Layout } from "../internal/Layout";
import { Links } from "../constants/links";

const router = createBrowserRouter([
  {
    path: Links.HOME,
    element: <Layout />,
    children: [
      {
        path: Links.HOME,
        element: <HomePage />,
      },
      {
        path: `${Links.WEATHER}/:city`,
        element: <WeatherPage />,
      },
      {
        path: `${Links.WEATHER}`,
        element: <WeatherPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
