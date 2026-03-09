import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import allUsersReducer from "../features/allUserSlice"
export const store = configureStore({
	reducer: {
		user: userReducer,
		allUsers: allUsersReducer
	},
});
