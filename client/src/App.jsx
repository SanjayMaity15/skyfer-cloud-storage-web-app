import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AppLayout from "../components/Layout/AppLayout";
import ErrorPage from "../pages/ErrorPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OtpPage from "../pages/OtpPage";


const App = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <AppLayout />,
			errorElement: <ErrorPage />,
			children: [
				{
					index: true,
					element: <HomePage />,
				},
				{
					path: "/login",
					element: <LoginPage/>
				},
				{
					path: "/register",
					element: <RegisterPage />
				},
				{
					path: "/otp",
					element: <OtpPage />
				}
			],
		},
	]);

	return <RouterProvider router={router} />;
};

export default App;
