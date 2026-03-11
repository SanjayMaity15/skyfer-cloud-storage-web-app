
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { ToastContainer, Zoom } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
	<GoogleOAuthProvider clientId={CLIENT_ID}>
		<Provider store={store}>
			<App />
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={true}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition={Zoom}
			/>
		</Provider>
	</GoogleOAuthProvider>,
);
