import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { Bounce, ToastContainer, Zoom } from 'react-toastify'

createRoot(document.getElementById("root")).render(
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
	</Provider>,
);
