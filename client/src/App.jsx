import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AppLayout from "../components/Layout/AppLayout";
import ErrorPage from "../pages/ErrorPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OtpPage from "../pages/OtpPage";
import DashboardLayout from "../components/Layout/DashboardLayout";
import DashboardHome from "../components/UI/DashboardHome";
import { useEffect, useState } from "react";
import { api } from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import { setPageLoading, setUser } from "./features/userSlice";
import ProtectedRoutes from "../components/UI/ProtectedRoutes";
import Starred from "../components/UI/Starred";
import Profile from "../components/UI/Profile";
import Popup from "../components/UI/Popup";
import ForgotPassword from "../components/UI/ForgotPassword";
import EditDetails from "../components/UI/EditDetails";
import EnablePassword from "../components/UI/EnablePassword";

const App = () => {
	const dispatch = useDispatch();
	// get current loggedin user

	const getCurrentLoggedInUser = async () => {
		try {
			const result = await api.get("/auth/current-user", {
				withCredentials: true,
			});
			
			dispatch(setUser(result?.data?.user));
			dispatch(setPageLoading(false));
		} catch (error) {
			dispatch(setPageLoading(false));
			console.log(error);
		}
	};

	useEffect(() => {
		getCurrentLoggedInUser();
	}, []);

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
					element: <LoginPage />,
				},
				{
					path: "/register",
					element: <RegisterPage />,
				},
				{
					path: "/otp",
					element: <OtpPage />,
				},
			],
		},
		{
			path: "/dashboard",
			element: (
				<ProtectedRoutes>
					<DashboardLayout />
				</ProtectedRoutes>
			),
			children: [
				{
					index: true,
					element: <DashboardHome />,
				},
				{
					path: "starred",
					element: <Starred />,
				},
			],
		},
		{
			path: "/profile",
			element: (
				<ProtectedRoutes>
					<Profile />
				</ProtectedRoutes>
			),
		},
		{
			path: "/edit-profile",
			element: <EditDetails />,
		},
		{
			path: "/reset-password",
			element: <ForgotPassword />,
		},
		{
			path: "/add-password",
			element: <EnablePassword />,
		},
	]);

	return <RouterProvider router={router} />;
};

export default App;
