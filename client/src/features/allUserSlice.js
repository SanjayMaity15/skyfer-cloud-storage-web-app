import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	allUsers: null,
	pageLoading: true,
};

export const allUserSlice = createSlice({
	name: "allUsers",
	initialState,
	reducers: {
		setAllUsers: (state, actions) => {
			state.allUsers = actions.payload;
		},
		setPageLoading: (state, actions) => {
			state.pageLoading = actions.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setAllUsers, setPageLoading } = allUserSlice.actions;

export default allUserSlice.reducer;
