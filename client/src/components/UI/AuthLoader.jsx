
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthLoader = ({ children }) => {
	const { user } = useSelector((state) => state.user);

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
};

export default AuthLoader;
