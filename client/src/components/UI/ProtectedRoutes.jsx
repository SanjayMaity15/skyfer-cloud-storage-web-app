
import { useSelector } from "react-redux";
import PageLoader from "./PageLoader";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
	const { pageLoading, user } = useSelector((state) => state.user);
	

	if (pageLoading) {
		return <PageLoader />;	
	}

	if (!user) {
		return <Navigate to="/login" />;
	}

	return children;
};

export default ProtectedRoutes;
