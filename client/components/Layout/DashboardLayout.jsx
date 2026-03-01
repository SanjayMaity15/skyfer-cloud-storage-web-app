import React from "react";
import { Outlet } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import { useSelector } from "react-redux";

const DashboardLayout = () => {
	const handleLogout = async () => {
		await api.post("/auth/logout", {}, { withCredentials: true });
	};



	const {user} = useSelector((state) => state.user)
	console.log(user);

	return (
		<div>
			DashboardLayout
			<button onClick={handleLogout}>Logout</button>
	
			<Outlet />
		</div>
	);
};

export default DashboardLayout;
