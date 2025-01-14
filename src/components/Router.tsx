import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/Home";
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
		],
	},
]);

export const Router = () => {
	return <RouterProvider router={router} />;
};
